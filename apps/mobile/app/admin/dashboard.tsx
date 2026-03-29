import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { trpc } from '@/lib/trpc';

function getWebStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function deleteWebStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage delete failures in demo flows.
  }
}

type OrgStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'DENIED' | 'APPEALED';
type AppealStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
type PostStatusFilter = 'ALL' | 'VISIBLE' | 'REMOVED';

const ORG_FILTERS: OrgStatusFilter[] = ['ALL', 'PENDING', 'APPROVED', 'DENIED', 'APPEALED'];
const APPEAL_FILTERS: AppealStatusFilter[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];
const POST_FILTERS: PostStatusFilter[] = ['ALL', 'VISIBLE', 'REMOVED'];

function isUnauthorized(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const maybeError = error as { message?: string; data?: { code?: string } };
  return (
    maybeError.data?.code === 'UNAUTHORIZED' ||
    maybeError.message?.toLowerCase().includes('admin authentication required') === true
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterChip, active ? styles.filterChipActive : styles.filterChipInactive]}
    >
      <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : styles.filterChipTextInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [adminEmail, setAdminEmail] = useState('admin');
  const [orgFilter, setOrgFilter] = useState<OrgStatusFilter>('ALL');
  const [appealFilter, setAppealFilter] = useState<AppealStatusFilter>('PENDING');
  const [postFilter, setPostFilter] = useState<PostStatusFilter>('ALL');

  const [orgSearch, setOrgSearch] = useState('');
  const [appealSearch, setAppealSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');

  const [appealDrafts, setAppealDrafts] = useState<Record<string, string>>({});

  const overviewQuery = trpc.admin.getOverview.useQuery();
  const organizationsQuery = trpc.admin.listOrganizations.useQuery({
    status: orgFilter,
    search: orgSearch.trim() || undefined,
  });
  const appealsQuery = trpc.admin.listAppeals.useQuery({
    status: appealFilter,
    search: appealSearch.trim() || undefined,
  });
  const postsQuery = trpc.admin.listPosts.useQuery({
    status: postFilter,
    search: postSearch.trim() || undefined,
  });

  const reviewOrgMutation = trpc.admin.reviewOrganization.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.admin.invalidate(), utils.opportunity.invalidate()]);
    },
  });

  const resolveAppealMutation = trpc.admin.resolveAppeal.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.admin.invalidate(), utils.opportunity.invalidate()]);
    },
  });

  const submitAppealMutation = trpc.admin.submitAppeal.useMutation({
    onSuccess: async () => {
      await utils.admin.invalidate();
    },
  });

  const moderatePostMutation = trpc.admin.moderatePost.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.admin.invalidate(), utils.opportunity.invalidate()]);
    },
  });

  const logoutMutation = trpc.admin.logout.useMutation();

  const loading =
    overviewQuery.isLoading ||
    organizationsQuery.isLoading ||
    appealsQuery.isLoading ||
    postsQuery.isLoading;

  const unauthorized = useMemo(
    () =>
      [overviewQuery.error, organizationsQuery.error, appealsQuery.error, postsQuery.error].some(isUnauthorized),
    [overviewQuery.error, organizationsQuery.error, appealsQuery.error, postsQuery.error]
  );

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      let storedToken: string | null = null;
      let storedEmail: string | null = null;

      try {
        [storedToken, storedEmail] = await Promise.all([
          SecureStore.getItemAsync('hourly_admin_token'),
          SecureStore.getItemAsync('hourly_admin_email'),
        ]);
      } catch {
        storedToken = null;
        storedEmail = null;
      }

      if (!storedToken) {
        storedToken = getWebStorageItem('hourly_admin_token');
      }

      if (!storedEmail) {
        storedEmail = getWebStorageItem('hourly_admin_email');
      }

      if (!storedToken) {
        router.replace('/admin/login' as never);
        return;
      }

      if (active && storedEmail) {
        setAdminEmail(storedEmail);
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!unauthorized) {
      return;
    }

    async function clearAndExit() {
      await Promise.all([
        SecureStore.deleteItemAsync('hourly_admin_token').catch(() => undefined),
        SecureStore.deleteItemAsync('hourly_admin_email').catch(() => undefined),
        SecureStore.deleteItemAsync('hourly_admin_expires_at').catch(() => undefined),
      ]);

      deleteWebStorageItem('hourly_admin_token');
      deleteWebStorageItem('hourly_admin_email');
      deleteWebStorageItem('hourly_admin_expires_at');
      router.replace('/admin/login' as never);
    }

    clearAndExit();
  }, [router, unauthorized]);

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Continue local sign-out even if API logout fails.
    }

    await Promise.all([
      SecureStore.deleteItemAsync('hourly_admin_token').catch(() => undefined),
      SecureStore.deleteItemAsync('hourly_admin_email').catch(() => undefined),
      SecureStore.deleteItemAsync('hourly_admin_expires_at').catch(() => undefined),
    ]);

    deleteWebStorageItem('hourly_admin_token');
    deleteWebStorageItem('hourly_admin_email');
    deleteWebStorageItem('hourly_admin_expires_at');

    router.replace('/admin/login' as never);
  }

  async function handleApproveOrg(orgId: string) {
    await reviewOrgMutation.mutateAsync({
      organizationId: orgId,
      decision: 'APPROVE',
    });
  }

  async function handleDenyOrg(orgId: string) {
    await reviewOrgMutation.mutateAsync({
      organizationId: orgId,
      decision: 'DENY',
      reason: 'Denied by administrator review. Please submit supporting details in appeal.',
    });
  }

  async function handleSubmitAppeal(orgId: string) {
    const message =
      appealDrafts[orgId]?.trim() ||
      'We have updated our organization profile and uploaded the requested verification documents.';

    await submitAppealMutation.mutateAsync({
      organizationId: orgId,
      message,
    });

    setAppealDrafts(prev => ({ ...prev, [orgId]: '' }));
  }

  async function handleResolveAppeal(orgId: string, decision: 'APPROVE' | 'REJECT') {
    await resolveAppealMutation.mutateAsync({
      organizationId: orgId,
      decision,
      note: decision === 'APPROVE' ? 'Appeal approved.' : 'Appeal rejected after review.',
    });
  }

  async function handleModeratePost(postId: string, action: 'REMOVE' | 'RESTORE') {
    await moderatePostMutation.mutateAsync({
      opportunityId: postId,
      action,
      reason: action === 'REMOVE' ? 'Temporarily removed by administrator.' : undefined,
    });
  }

  if (loading && !overviewQuery.data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </View>
    );
  }

  const overview = overviewQuery.data;
  const organizations = organizationsQuery.data ?? [];
  const appeals = appealsQuery.data ?? [];
  const posts = postsQuery.data ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {adminEmail}</Text>
        </View>
        <PillButton variant="default" size="small" onPress={handleLogout}>
          Sign out
        </PillButton>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{overview?.orgCounts.pending ?? 0}</Text>
          <Text style={styles.statLabel}>Pending Orgs</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{overview?.pendingAppeals ?? 0}</Text>
          <Text style={styles.statLabel}>Open Appeals</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{overview?.postCounts.removed ?? 0}</Text>
          <Text style={styles.statLabel}>Removed Posts</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Organizations</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search organizations"
        placeholderTextColor={Colors.dark.textTertiary}
        value={orgSearch}
        onChangeText={setOrgSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {ORG_FILTERS.map(item => (
          <FilterChip
            key={item}
            label={item}
            active={orgFilter === item}
            onPress={() => setOrgFilter(item)}
          />
        ))}
      </ScrollView>

      {organizations.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No organizations match these filters.</Text>
        </Card>
      ) : null}

      {organizations.map(org => (
        <Card key={org.id} style={styles.dataCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{org.name}</Text>
            <Text style={styles.statusText}>{org.status}</Text>
          </View>
          <Text style={styles.cardSubtext}>{org.contactEmail}</Text>
          <Text style={styles.cardMeta}>
            Tags: {org.causeTags.join(', ')} | Posts: {org.visiblePostCount}/{org.postCount}
          </Text>
          {org.denialReason ? <Text style={styles.warningText}>Denial reason: {org.denialReason}</Text> : null}
          {org.appeal ? (
            <Text style={styles.cardMeta}>
              Appeal: {org.appeal.status} · {org.appeal.message}
            </Text>
          ) : null}

          <View style={styles.actionRow}>
            <PillButton
              variant="primary"
              size="small"
              onPress={() => handleApproveOrg(org.id)}
              disabled={reviewOrgMutation.isPending}
            >
              Approve
            </PillButton>
            <PillButton
              variant="default"
              size="small"
              onPress={() => handleDenyOrg(org.id)}
              disabled={reviewOrgMutation.isPending}
            >
              Deny
            </PillButton>
          </View>

          {org.status === 'DENIED' ? (
            <View style={styles.inlineBlock}>
              <TextInput
                style={styles.inlineInput}
                placeholder="Appeal message from organization"
                placeholderTextColor={Colors.dark.textTertiary}
                value={appealDrafts[org.id] ?? ''}
                onChangeText={value =>
                  setAppealDrafts(prev => ({
                    ...prev,
                    [org.id]: value,
                  }))
                }
              />
              <PillButton
                variant="ghost"
                size="small"
                onPress={() => handleSubmitAppeal(org.id)}
                disabled={submitAppealMutation.isPending}
              >
                Create Appeal Ticket
              </PillButton>
            </View>
          ) : null}

          {org.status === 'APPEALED' && org.appeal?.status === 'PENDING' ? (
            <View style={styles.actionRow}>
              <PillButton
                variant="primary"
                size="small"
                onPress={() => handleResolveAppeal(org.id, 'APPROVE')}
                disabled={resolveAppealMutation.isPending}
              >
                Approve Appeal
              </PillButton>
              <PillButton
                variant="default"
                size="small"
                onPress={() => handleResolveAppeal(org.id, 'REJECT')}
                disabled={resolveAppealMutation.isPending}
              >
                Reject Appeal
              </PillButton>
            </View>
          ) : null}
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Appeals Queue</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search appeals"
        placeholderTextColor={Colors.dark.textTertiary}
        value={appealSearch}
        onChangeText={setAppealSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {APPEAL_FILTERS.map(item => (
          <FilterChip
            key={item}
            label={item}
            active={appealFilter === item}
            onPress={() => setAppealFilter(item)}
          />
        ))}
      </ScrollView>

      {appeals.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No appeals match these filters.</Text>
        </Card>
      ) : null}

      {appeals.map(item => (
        <Card key={item.appeal.id} style={styles.dataCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.organizationName}</Text>
            <Text style={styles.statusText}>{item.appeal.status}</Text>
          </View>
          <Text style={styles.cardSubtext}>{item.organizationEmail}</Text>
          <Text style={styles.cardMeta}>Submitted: {new Date(item.appeal.submittedAt).toLocaleString()}</Text>
          <Text style={styles.cardMeta}>{item.appeal.message}</Text>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Posts Moderation</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search posts"
        placeholderTextColor={Colors.dark.textTertiary}
        value={postSearch}
        onChangeText={setPostSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {POST_FILTERS.map(item => (
          <FilterChip
            key={item}
            label={item}
            active={postFilter === item}
            onPress={() => setPostFilter(item)}
          />
        ))}
      </ScrollView>

      {posts.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No posts match these filters.</Text>
        </Card>
      ) : null}

      {posts.map(post => (
        <Card key={post.id} style={styles.dataCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{post.title}</Text>
            <Text style={styles.statusText}>{post.postStatus}</Text>
          </View>
          <Text style={styles.cardSubtext}>{post.orgName}</Text>
          <Text style={styles.cardMeta}>
            Org status: {post.orgStatus} | Student visible: {post.canShowToStudents ? 'Yes' : 'No'}
          </Text>
          {post.removedReason ? <Text style={styles.warningText}>Reason: {post.removedReason}</Text> : null}

          <View style={styles.actionRow}>
            {post.postStatus === 'REMOVED' ? (
              <PillButton
                variant="primary"
                size="small"
                onPress={() => handleModeratePost(post.id, 'RESTORE')}
                disabled={moderatePostMutation.isPending}
              >
                Restore Post
              </PillButton>
            ) : (
              <PillButton
                variant="default"
                size="small"
                onPress={() => handleModeratePost(post.id, 'REMOVE')}
                disabled={moderatePostMutation.isPending}
              >
                Remove Post
              </PillButton>
            )}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.base,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    color: Colors.dark.textPrimary,
    fontFamily: Typography.valueLarge.fontFamily,
    fontSize: 28,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.body.fontFamily,
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
  },
  statValue: {
    color: Colors.dark.textPrimary,
    fontFamily: Typography.valueMedium.fontFamily,
    fontSize: 22,
    fontWeight: '600',
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.caption.fontFamily,
    fontSize: Typography.caption.fontSize,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.dark.textPrimary,
    fontFamily: Typography.valueMedium.fontFamily,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: Colors.dark.element,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.dark.textPrimary,
    fontSize: 14,
  },
  filterRow: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.tealSoft,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  filterChipInactive: {
    backgroundColor: Colors.dark.element,
  },
  filterChipText: {
    fontFamily: Typography.caption.fontFamily,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  filterChipTextActive: {
    color: Colors.teal,
  },
  filterChipTextInactive: {
    color: Colors.dark.textSecondary,
  },
  dataCard: {
    padding: 18,
    borderRadius: 18,
    gap: 8,
  },
  emptyCard: {
    borderRadius: 18,
    padding: 16,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.body.fontFamily,
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: Colors.dark.textPrimary,
    fontFamily: Typography.label.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusText: {
    color: Colors.teal,
    fontFamily: Typography.sub.fontFamily,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardSubtext: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.body.fontFamily,
    fontSize: 13,
  },
  cardMeta: {
    color: Colors.dark.textSecondary,
    fontFamily: Typography.caption.fontFamily,
    fontSize: 12,
    lineHeight: 18,
  },
  warningText: {
    color: Colors.warning,
    fontFamily: Typography.caption.fontFamily,
    fontSize: 12,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  inlineBlock: {
    gap: 8,
    marginTop: 4,
  },
  inlineInput: {
    backgroundColor: Colors.dark.element,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.dark.textPrimary,
    fontSize: 13,
  },
});
