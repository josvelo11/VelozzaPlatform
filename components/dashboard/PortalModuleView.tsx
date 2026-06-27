'use client';

import { useEffect, useMemo, useState } from 'react';
import { PortalModuleData, PortalRecord } from '@/types/portal';
import { getStatusStyle } from '@/lib/utils/status-styles';
import { PortalType } from '@/types/portal';
import { getClientProfileByEmail } from '@/lib/auth/access-control';

interface PortalModuleViewProps {
  module: PortalModuleData;
  portal: PortalType;
}

type SocialProfile = {
  id: string;
  client: string;
  platform: string;
  username: string;
  password: string;
  profileUrl: string;
  status: 'connected' | 'needs-reauthorization' | 'manual-required';
};

type ClientDocument = {
  id: string;
  title: string;
  type: string;
  status: PortalRecord['status'];
  url: string;
  note: string;
};

type PublicationType = 'reel' | 'carrusel' | 'flyer';

type AdvertisingCalendarEntry = {
  id: string;
  accountId: string;
  publicationDate: string;
  platform: string;
  publicationType: PublicationType;
  publicationName: string;
  publishedPost: string;
  status: PortalRecord['status'];
};

type AdvertisingAccountProfile = {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  sector: string;
  socialNetworks: string;
  age: string;
  status: PortalRecord['status'];
};

const SOCIAL_STORAGE_KEY = 'velozza-social-profiles-v1';
const REALTIME_CHANNEL = 'velozza-module-realtime-v1';

type ModuleRealtimeState = {
  metrics: PortalModuleData['metrics'];
  records: PortalRecord[];
  checklist: PortalModuleData['checklist'];
  workflow: PortalModuleData['workflow'];
  timeline: PortalModuleData['timeline'];
  quickActions: PortalModuleData['quickActions'];
  advertisingAccounts?: AdvertisingAccountProfile[];
  advertisingCalendar?: AdvertisingCalendarEntry[];
  selectedAdvertisingAccountId?: string;
  clientTab?: 'informacion' | 'crm' | 'redes' | 'calendario' | 'metricas' | 'documentos';
  selectedCalendarDay?: string;
  clientInfoDraft?: {
    companyName: string;
    contactName: string;
    sector: string;
    plan: string;
    accountManager: string;
  };
  clientDocuments?: Array<{
    id: string;
    title: string;
    type: string;
    status: PortalRecord['status'];
    url: string;
    note: string;
  }>;
};

export default function PortalModuleView({ module, portal }: PortalModuleViewProps) {
  const buildInitialAdvertisingAccounts = (seed: PortalRecord[]): AdvertisingAccountProfile[] =>
    seed.slice(0, 8).map((item, index) => ({
      id: `adv-acc-${index + 1}`,
      firstName: item.owner.split(' ')[0] || `Cliente ${index + 1}`,
      lastName: item.owner.split(' ').slice(1).join(' '),
      profession: 'Profesional Independiente',
      sector: 'Servicios',
      socialNetworks: 'Instagram, Facebook',
      age: '30',
      status: item.status,
    }));

  const buildInitialAdvertisingCalendar = (seed: PortalRecord[]): AdvertisingCalendarEntry[] =>
    seed.slice(0, 8).map((item, index) => ({
      id: `adv-cal-${index + 1}`,
      accountId: `adv-acc-${index + 1}`,
      publicationDate: item.dueDate || `2026-07-${String((index % 28) + 1).padStart(2, '0')}`,
      platform: ['Instagram', 'Facebook', 'TikTok', 'YouTube'][index % 4],
      publicationType: (['reel', 'carrusel', 'flyer'][index % 3] as PublicationType),
      publicationName: item.title,
      publishedPost: '',
      status: item.status,
    }));

  const [query, setQuery] = useState('');
  const [metrics, setMetrics] = useState(module.metrics);
  const [records, setRecords] = useState<PortalRecord[]>(module.records);
  const [checklist, setChecklist] = useState(module.checklist);
  const [workflow, setWorkflow] = useState(module.workflow);
  const [timeline, setTimeline] = useState(module.timeline);
  const [quickActions] = useState(module.quickActions);
  const [editMode, setEditMode] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDate, setNewTimelineDate] = useState('');
  const [newTimelineType, setNewTimelineType] = useState<'meeting' | 'delivery' | 'approval' | 'note'>('meeting');
  const [advertisingAccounts, setAdvertisingAccounts] = useState<AdvertisingAccountProfile[]>(
    buildInitialAdvertisingAccounts(module.records)
  );
  const [newAccountFirstName, setNewAccountFirstName] = useState('');
  const [newAccountLastName, setNewAccountLastName] = useState('');
  const [newAccountProfession, setNewAccountProfession] = useState('');
  const [newAccountSector, setNewAccountSector] = useState('');
  const [newAccountSocialNetworks, setNewAccountSocialNetworks] = useState('');
  const [newAccountAge, setNewAccountAge] = useState('');
  const [newAccountStatus, setNewAccountStatus] = useState<PortalRecord['status']>('draft');
  const [selectedAdvertisingAccountId, setSelectedAdvertisingAccountId] = useState('');
  const [advertisingCalendar, setAdvertisingCalendar] = useState<AdvertisingCalendarEntry[]>(
    buildInitialAdvertisingCalendar(module.records)
  );
  const [newCalendarDate, setNewCalendarDate] = useState('');
  const [newCalendarPlatform, setNewCalendarPlatform] = useState('Instagram');
  const [newCalendarType, setNewCalendarType] = useState<PublicationType>('reel');
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarPost, setNewCalendarPost] = useState('');
  const [newCalendarStatus, setNewCalendarStatus] = useState<PortalRecord['status']>('draft');
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([]);
  const [socialClient, setSocialClient] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('Instagram');
  const [socialUsername, setSocialUsername] = useState('');
  const [socialPassword, setSocialPassword] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialEditingId, setSocialEditingId] = useState<string | null>(null);
  const [clientTab, setClientTab] = useState<'informacion' | 'crm' | 'redes' | 'calendario' | 'metricas' | 'documentos'>('informacion');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState('');
  const [clientInfoDraft, setClientInfoDraft] = useState({
    companyName: '',
    contactName: '',
    sector: '',
    plan: '',
    accountManager: '',
  });
  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([
    { id: 'doc-1', title: 'Brief creativo', type: 'PDF', status: 'active', url: '#', note: 'Documento base cargado por Velozza' },
    { id: 'doc-2', title: 'Reporte mensual', type: 'PDF', status: 'review' as const, url: '#', note: 'Pendiente de validacion' },
    { id: 'doc-3', title: 'Lineamientos de marca', type: 'DOCX', status: 'active' as const, url: '#', note: 'Uso interno y cliente' },
  ]);
  const [settingsState, setSettingsState] = useState({
    emailAlerts: true,
    weeklySummary: true,
    approvalRequired: true,
    autoPublish: false,
  });
  const moduleStateKey = useMemo(() => `velozza-module-state-v2:${portal}:${module.slug}`, [portal, module.slug]);

  const applyRealtimeState = (next: Partial<ModuleRealtimeState>) => {
    if (Array.isArray(next.metrics)) setMetrics(next.metrics);
    if (Array.isArray(next.records)) setRecords(next.records);
    if (Array.isArray(next.checklist)) setChecklist(next.checklist);
    if (Array.isArray(next.workflow)) setWorkflow(next.workflow);
    if (Array.isArray(next.timeline)) setTimeline(next.timeline);
    if (Array.isArray(next.advertisingAccounts)) setAdvertisingAccounts(next.advertisingAccounts);
    if (Array.isArray(next.advertisingCalendar)) setAdvertisingCalendar(next.advertisingCalendar);
    if (typeof next.selectedAdvertisingAccountId === 'string') {
      setSelectedAdvertisingAccountId(next.selectedAdvertisingAccountId);
    }
    if (typeof next.clientTab === 'string') setClientTab(next.clientTab);
    if (typeof next.selectedCalendarDay === 'string') setSelectedCalendarDay(next.selectedCalendarDay);
    if (next.clientInfoDraft) setClientInfoDraft(next.clientInfoDraft);
    if (Array.isArray(next.clientDocuments)) setClientDocuments(next.clientDocuments);
  };

  useEffect(() => {
    const initialAccounts = buildInitialAdvertisingAccounts(module.records);
    setMetrics(module.metrics);
    setRecords(module.records);
    setChecklist(module.checklist);
    setWorkflow(module.workflow);
    setTimeline(module.timeline);
    setAdvertisingAccounts(initialAccounts);
    setAdvertisingCalendar(buildInitialAdvertisingCalendar(module.records));
    setSelectedAdvertisingAccountId(initialAccounts[0]?.id || '');
  }, [module]);

  useEffect(() => {
    if (module.slug !== 'publication-planner') return;
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('sb-user-email') || '' : '';
    const profile = getClientProfileByEmail(storedEmail);
    if (profile) {
      setClientInfoDraft({
        companyName: profile.companyName,
        contactName: profile.contactName,
        sector: profile.sector || 'Marketing y redes',
        plan: profile.plan,
        accountManager: profile.accountManager,
      });
    }
  }, [module.slug]);

  useEffect(() => {
    if (module.slug !== 'social-accounts' || socialClient) return;
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('sb-user-email') || '' : '';
    const profile = getClientProfileByEmail(storedEmail);
    if (profile?.companyName) {
      setSocialClient(profile.companyName);
    }
  }, [module.slug, socialClient]);

  useEffect(() => {
    if (module.slug !== 'publication-planner') return;
    if (selectedCalendarDay) return;
    const firstDate = module.records.find((record) => record.dueDate)?.dueDate || new Date().toISOString().slice(0, 10);
    setSelectedCalendarDay(firstDate);
  }, [module.slug, module.records, selectedCalendarDay]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(moduleStateKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<ModuleRealtimeState>;
      applyRealtimeState(parsed);
    } catch {
      // Ignore malformed persisted module state.
    }
  }, [moduleStateKey]);

  useEffect(() => {
    const nextState: ModuleRealtimeState = {
      metrics,
      records,
      checklist,
      workflow,
      timeline,
      quickActions,
      advertisingAccounts,
      advertisingCalendar,
      selectedAdvertisingAccountId,
      clientTab,
      selectedCalendarDay,
      clientInfoDraft,
      clientDocuments,
    };
    localStorage.setItem(moduleStateKey, JSON.stringify(nextState));

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(REALTIME_CHANNEL);
      channel.postMessage({ key: moduleStateKey, state: nextState });
      channel.close();
    }
  }, [moduleStateKey, metrics, records, checklist, workflow, timeline, quickActions, advertisingAccounts, advertisingCalendar, selectedAdvertisingAccountId]);

  const consolidateAdvertisingStatus = (entries: AdvertisingCalendarEntry[]): PortalRecord['status'] => {
    if (!entries.length) return 'draft';
    const statuses = entries.map((item) => item.status);
    if (statuses.includes('blocked')) return 'blocked';
    if (statuses.includes('review')) return 'review';
    if (statuses.includes('pending')) return 'pending';
    if (statuses.includes('scheduled')) return 'scheduled';
    if (statuses.every((status) => status === 'completed')) return 'completed';
    if (statuses.includes('active')) return 'active';
    if (statuses.every((status) => status === 'archived')) return 'archived';
    return 'draft';
  };

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== moduleStateKey || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as Partial<ModuleRealtimeState>;
        applyRealtimeState(parsed);
      } catch {
        // Ignore malformed cross-tab state.
      }
    };

    window.addEventListener('storage', onStorage);

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(REALTIME_CHANNEL);
      channel.onmessage = (event) => {
        const payload = event.data as { key?: string; state?: Partial<ModuleRealtimeState> };
        if (!payload || payload.key !== moduleStateKey || !payload.state) return;
        applyRealtimeState(payload.state);
      };
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (channel) channel.close();
    };
  }, [moduleStateKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SOCIAL_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SocialProfile[];
      if (Array.isArray(parsed)) {
        setSocialProfiles(parsed);
      }
    } catch {
      // Ignore malformed browser storage.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(socialProfiles));
  }, [socialProfiles]);

  useEffect(() => {
    if (!advertisingAccounts.length) {
      setSelectedAdvertisingAccountId('');
      return;
    }

    const exists = advertisingAccounts.some((account) => account.id === selectedAdvertisingAccountId);
    if (!exists) {
      setSelectedAdvertisingAccountId(advertisingAccounts[0].id);
    }
  }, [advertisingAccounts, selectedAdvertisingAccountId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((item) =>
      `${item.id} ${item.title} ${item.owner} ${item.status}`.toLowerCase().includes(q)
    );
  }, [records, query]);

  const statusSummary = useMemo(() => {
    return records.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [records]);

  const doneCount = checklist.filter((item) => item.done).length;

  const handlePrimaryAction = () => {
    if (module.slug === 'advertising-accounts') {
      const accountId = `adv-acc-${Date.now()}`;
      const newAccount: AdvertisingAccountProfile = {
        id: accountId,
        firstName: '',
        lastName: '',
        profession: '',
        sector: '',
        socialNetworks: '',
        age: '',
        status: 'draft',
      };
      setAdvertisingAccounts((prev) => [newAccount, ...prev]);
      setSelectedAdvertisingAccountId(accountId);
      setRecords((prev) => [
        {
          id: `adv-client-${accountId}`,
          title: 'Nuevo cliente publicitario',
          owner: 'Cuenta Publicitaria',
          status: 'draft',
          dueDate: undefined,
          priority: 'medium',
        },
        ...prev,
      ]);
      setEditMode(true);
      return;
    }

    const nextIndex = records.length + 1;
    const now = new Date();
    const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueDate = due.toISOString().slice(0, 10);

    const newRecord: PortalRecord = {
      id: `${module.slug}-NEW-${String(nextIndex).padStart(2, '0')}`,
      title: `${module.title} registro operativo ${nextIndex}`,
      owner: 'Current User',
      status: 'draft',
      dueDate,
      priority: 'medium',
    };

    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleSecondaryAction = () => {
    const header = ['id', 'title', 'owner', 'status', 'due_date', 'priority'];
    const lines = records.map((r) => [r.id, r.title, r.owner, r.status, r.dueDate || '', r.priority || '']);
    const csv = [header, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).split('"').join('""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${module.slug}-records.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const updateRecord = (id: string, field: keyof PortalRecord, value: string) => {
    setRecords((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'status') return { ...item, status: value as PortalRecord['status'] };
        if (field === 'priority') return { ...item, priority: value as PortalRecord['priority'] };
        return { ...item, [field]: value };
      })
    );
  };

  const removeRecord = (id: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const addChecklistItem = () => {
    const title = newChecklistTitle.trim();
    if (!title) return;
    setChecklist((prev) => [
      ...prev,
      { id: `${module.slug}-chk-${Date.now()}`, title, done: false, owner: 'Current User' },
    ]);
    setNewChecklistTitle('');
  };

  const addTimelineEvent = () => {
    const title = newTimelineTitle.trim();
    if (!title || !newTimelineDate) return;
    setTimeline((prev) => [
      ...prev,
      { id: `${module.slug}-ev-${Date.now()}`, title, date: newTimelineDate, type: newTimelineType },
    ]);
    setNewTimelineTitle('');
    setNewTimelineDate('');
  };

  const updateTimelineEvent = (id: string, field: 'title' | 'date', value: string) => {
    setTimeline((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeTimelineEvent = (id: string) => {
    setTimeline((prev) => prev.filter((item) => item.id !== id));
  };

  const addAdvertisingAccount = () => {
    const firstName = newAccountFirstName.trim();
    const lastName = newAccountLastName.trim();
    if (!firstName || !lastName) return;

    const accountId = `adv-acc-${Date.now()}`;
    const next: AdvertisingAccountProfile = {
      id: accountId,
      firstName,
      lastName,
      profession: newAccountProfession.trim(),
      sector: newAccountSector.trim(),
      socialNetworks: newAccountSocialNetworks.trim(),
      age: newAccountAge.trim(),
      status: newAccountStatus,
    };

    setAdvertisingAccounts((prev) => [next, ...prev]);
    setSelectedAdvertisingAccountId(accountId);
    setRecords((prev) => [
      {
        id: `adv-client-${accountId}`,
        title: `${firstName} ${lastName}`.trim(),
        owner: 'Cuenta Publicitaria',
        status: next.status,
        dueDate: undefined,
        priority: 'medium',
      },
      ...prev,
    ]);
    setNewAccountFirstName('');
    setNewAccountLastName('');
    setNewAccountProfession('');
    setNewAccountSector('');
    setNewAccountSocialNetworks('');
    setNewAccountAge('');
    setNewAccountStatus('draft');
  };

  const updateAdvertisingAccount = (id: string, field: keyof AdvertisingAccountProfile, value: string) => {
    setAdvertisingAccounts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = field === 'status'
          ? { ...item, status: value as PortalRecord['status'] }
          : { ...item, [field]: value };

        setRecords((recordsPrev) =>
          recordsPrev.map((record) =>
            record.id === `adv-client-${id}`
              ? {
                  ...record,
                  title: `${updated.firstName} ${updated.lastName}`.trim() || 'Cliente publicitario',
                  status: updated.status,
                }
              : record
          )
        );

        return updated;
      })
    );
  };

  const removeAdvertisingAccount = (id: string) => {
    setAdvertisingAccounts((prev) => prev.filter((item) => item.id !== id));
    setAdvertisingCalendar((prev) => prev.filter((item) => item.accountId !== id));
    setRecords((prev) => prev.filter((item) => item.id !== `adv-client-${id}`));
    setSelectedAdvertisingAccountId((prev) => (prev === id ? '' : prev));
  };

  const addAdvertisingCalendarEntry = () => {
    if (!selectedAdvertisingAccountId) return;
    const publicationName = newCalendarName.trim();
    if (!newCalendarDate || !publicationName) return;

    const next: AdvertisingCalendarEntry = {
      id: `adv-cal-${Date.now()}`,
      accountId: selectedAdvertisingAccountId,
      publicationDate: newCalendarDate,
      platform: newCalendarPlatform,
      publicationType: newCalendarType,
      publicationName,
      publishedPost: newCalendarPost.trim(),
      status: newCalendarStatus,
    };

    setAdvertisingCalendar((prev) => {
      const nextEntries = [next, ...prev];
      const ownEntries = nextEntries.filter((item) => item.accountId === selectedAdvertisingAccountId);
      const consolidated = consolidateAdvertisingStatus(ownEntries);
      setAdvertisingAccounts((accountsPrev) =>
        accountsPrev.map((account) =>
          account.id === selectedAdvertisingAccountId ? { ...account, status: consolidated } : account
        )
      );
      setRecords((recordsPrev) =>
        recordsPrev.map((record) =>
          record.id === `adv-client-${selectedAdvertisingAccountId}` ? { ...record, status: consolidated } : record
        )
      );
      return nextEntries;
    });
    setNewCalendarDate('');
    setNewCalendarName('');
    setNewCalendarPost('');
    setNewCalendarStatus('draft');
  };

  const updateAdvertisingCalendarEntry = (id: string, field: keyof AdvertisingCalendarEntry, value: string) => {
    setAdvertisingCalendar((prev) =>
      {
        const nextEntries = prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'publicationType') return { ...item, publicationType: value as PublicationType };
        if (field === 'status') return { ...item, status: value as PortalRecord['status'] };
        return { ...item, [field]: value };
        });

        const target = nextEntries.find((item) => item.id === id);
        if (target) {
          const ownEntries = nextEntries.filter((item) => item.accountId === target.accountId);
          const consolidated = consolidateAdvertisingStatus(ownEntries);
          setAdvertisingAccounts((accountsPrev) =>
            accountsPrev.map((account) =>
              account.id === target.accountId ? { ...account, status: consolidated } : account
            )
          );
          setRecords((recordsPrev) =>
            recordsPrev.map((record) =>
              record.id === `adv-client-${target.accountId}` ? { ...record, status: consolidated } : record
            )
          );
        }

        return nextEntries;
      }
    );
  };

  const removeAdvertisingCalendarEntry = (id: string) => {
    setAdvertisingCalendar((prev) => {
      const removed = prev.find((item) => item.id === id);
      const nextEntries = prev.filter((item) => item.id !== id);

      if (removed) {
        const ownEntries = nextEntries.filter((item) => item.accountId === removed.accountId);
        const consolidated = consolidateAdvertisingStatus(ownEntries);
        setAdvertisingAccounts((accountsPrev) =>
          accountsPrev.map((account) =>
            account.id === removed.accountId ? { ...account, status: consolidated } : account
          )
        );
        setRecords((recordsPrev) =>
          recordsPrev.map((record) =>
            record.id === `adv-client-${removed.accountId}` ? { ...record, status: consolidated } : record
          )
        );
      }

      return nextEntries;
    });
  };

  const renderAutonomousSection = () => {
    if (module.slug === 'dashboard') {
      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Resumen Ejecutivo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: '10px', padding: '12px' }}>
              <p style={{ margin: 0, color: 'rgba(248,245,237,0.7)' }}>Client Health Score</p>
              <p style={{ margin: '6px 0 0', fontSize: '28px', color: '#7dffb3', fontWeight: 800 }}>82</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: '10px', padding: '12px' }}>
              <p style={{ margin: 0, color: 'rgba(248,245,237,0.7)' }}>Revenue Runrate</p>
              <p style={{ margin: '6px 0 0', fontSize: '28px', color: '#f4cf63', fontWeight: 800 }}>$148K</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: '10px', padding: '12px' }}>
              <p style={{ margin: 0, color: 'rgba(248,245,237,0.7)' }}>Alerts Criticas</p>
              <p style={{ margin: '6px 0 0', fontSize: '28px', color: '#ff8f8f', fontWeight: 800 }}>3</p>
            </div>
          </div>
        </div>
      );
    }

    if (module.slug === 'intake' || module.slug === 'intake-review') {
      const sections = [
        { name: 'Business Profile', pct: 100 },
        { name: 'Audience & ICP', pct: 80 },
        { name: 'Brand Voice', pct: 75 },
        { name: 'Competitors', pct: 65 },
        { name: 'Goals & KPI', pct: 90 },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Estado del Intake</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {sections.map((section) => (
              <div key={section.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#f8f5ed' }}>
                  <span>{section.name}</span>
                  <span>{section.pct}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${section.pct}%`, background: '#f4cf63', height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (module.slug === 'calendar') {
      const agenda = [
        { day: 'Lun', item: 'Sprint planning', time: '09:00' },
        { day: 'Mar', item: 'Content QA', time: '11:30' },
        { day: 'Mie', item: 'Client approvals', time: '15:00' },
        { day: 'Jue', item: 'Reporting sync', time: '10:00' },
        { day: 'Vie', item: 'Publishing batch', time: '16:00' },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Agenda Semanal</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {agenda.map((slot) => (
              <div key={slot.day + slot.time} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 80px', gap: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px 10px', color: '#f8f5ed' }}>
                <strong>{slot.day}</strong>
                <span>{slot.item}</span>
                <span style={{ color: '#f4cf63', textAlign: 'right' }}>{slot.time}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (module.slug === 'messages') {
      const threads = [
        { contact: 'Acme Foods', topic: 'Aprobacion campaña julio', unread: 2 },
        { contact: 'North Law Group', topic: 'Brief de reels Q3', unread: 0 },
        { contact: 'Team Editorial', topic: 'Cambio de prioridad', unread: 5 },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Bandeja de Conversaciones</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {threads.map((thread) => (
              <div key={thread.contact} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{thread.contact}</strong>
                  <span style={{ color: thread.unread ? '#f4cf63' : 'rgba(248,245,237,0.6)' }}>{thread.unread ? `${thread.unread} sin leer` : 'al dia'}</span>
                </div>
                <p style={{ margin: '4px 0 0', color: 'rgba(248,245,237,0.75)' }}>{thread.topic}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (module.slug === 'analytics' || module.slug === 'reports') {
      const bars = [
        { label: 'Reach', value: 78 },
        { label: 'Engagement', value: 64 },
        { label: 'Leads', value: 52 },
        { label: 'Revenue', value: 71 },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Performance Snapshot</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {bars.map((bar) => (
              <div key={bar.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#f8f5ed' }}>
                  <span>{bar.label}</span>
                  <span>{bar.value}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${bar.value}%`, background: '#f4cf63', height: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (module.slug === 'billing' || module.slug === 'packages') {
      const plans = [
        { name: 'Growth', price: '$1,200', status: 'active' },
        { name: 'Professional', price: '$2,400', status: 'review' },
        { name: 'Executive', price: '$4,200', status: 'pending' },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Planes y Facturacion</h3>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
            {plans.map((plan) => {
              const statusStyle = getStatusStyle(plan.status as PortalRecord['status']);
              return (
                <div key={plan.name} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: '10px', padding: '12px', color: '#f8f5ed' }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{plan.name}</p>
                  <p style={{ margin: '6px 0', color: '#f4cf63', fontSize: '24px', fontWeight: 800 }}>{plan.price}</p>
                  <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px' }}>{plan.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (module.slug === 'social-accounts') {
      const baseClients = ['Acme Foods', 'North Law Group', 'Velozza Internal'];
      const platforms = [
        'Instagram',
        'Facebook',
        'TikTok',
        'LinkedIn',
        'YouTube',
        'X',
        'Pinterest',
        'Google Business',
        'Threads',
        'WhatsApp Business',
      ];

      const ownerEmail = typeof window !== 'undefined' ? localStorage.getItem('sb-user-email') || '' : '';
      const clientName = portal === 'client' ? (ownerEmail.split('@')[0] || 'Client Account') : socialClient;
      const clients = Array.from(new Set([...baseClients, ...socialProfiles.map((item) => item.client), clientName]));
      const filteredProfiles = socialProfiles.filter((item) => item.client === clientName);
      const currentClientDirectory = portal === 'client' ? getClientProfileByEmail(ownerEmail) : null;

      const normalizeUrl = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return '';
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      };

      const seedProfile = (platform: string) => {
        const stored = filteredProfiles.find((item) => item.platform === platform);
        const directory = currentClientDirectory?.networkProfiles?.find((item) => item.platform.toLowerCase() === platform.toLowerCase());
        return stored || (directory
          ? {
              id: `seed-${platform.toLowerCase()}`,
              client: clientName,
              platform,
              username: directory.handle.replace(/^@/, ''),
              password: '',
              profileUrl: directory.url,
              status: 'connected' as const,
            }
          : null);
      };

      const addProfile = () => {
        const profileUrl = normalizeUrl(socialUrl);
        const username = socialUsername.trim();
        if (!profileUrl || !username) return;

        const next: SocialProfile = {
          id: socialEditingId || `soc-${Date.now()}`,
          client: clientName,
          platform: socialPlatform,
          username,
          password: socialPassword,
          profileUrl,
          status: 'connected',
        };

        setSocialProfiles((prev) => {
          const withoutCurrent = prev.filter((item) => item.id !== next.id && !(item.client === clientName && item.platform === socialPlatform));
          return [next, ...withoutCurrent];
        });
        setSocialEditingId(null);
        setSocialUsername('');
        setSocialPassword('');
        setSocialUrl('');
      };

      const removeProfile = (id: string) => {
        setSocialProfiles((prev) => prev.filter((item) => item.id !== id));
      };

      const editProfile = (profile: SocialProfile) => {
        setSocialPlatform(profile.platform);
        setSocialUsername(profile.username);
        setSocialPassword(profile.password);
        setSocialUrl(profile.profileUrl.replace(/^https?:\/\//i, ''));
        setSocialEditingId(profile.id.startsWith('seed-') ? null : profile.id);
      };

      const clearForm = () => {
        setSocialEditingId(null);
        setSocialUsername('');
        setSocialPassword('');
        setSocialUrl('');
      };

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Redes Sociales por Cliente</h3>
          <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)' }}>
            Cada red queda separada por plataforma y se edita con usuario, clave y enlace propios.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px', marginBottom: '12px' }}>
            {portal !== 'client' ? (
              <select value={socialClient} onChange={(e) => setSocialClient(e.target.value)} style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}>
                {clients.map((client) => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            ) : (
              <div style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}>
                Cliente: {currentClientDirectory?.companyName || clientName}
              </div>
            )}

            <select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>

            <input
              value={socialUsername}
              onChange={(e) => setSocialUsername(e.target.value)}
              placeholder='Usuario de la red'
              style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}
            />
            <input
              value={socialPassword}
              onChange={(e) => setSocialPassword(e.target.value)}
              placeholder='Clave o token'
              type='password'
              style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}
            />
            <input
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder='https://perfil-social.com/cliente'
              style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={addProfile}
              style={{
                background: '#f4cf63',
                color: '#0b0b0b',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {socialEditingId ? 'Actualizar perfil' : 'Guardar perfil social'}
            </button>
            <button
              onClick={clearForm}
              style={{
                background: 'transparent',
                color: '#f8f5ed',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Limpiar formulario
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px', marginBottom: '14px' }}>
            {platforms.map((platform) => {
              const saved = seedProfile(platform);
              const isConnected = Boolean(saved?.profileUrl);

              return (
                <div key={platform} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                    <strong>{platform}</strong>
                    <span style={{ color: isConnected ? '#7dffb3' : '#f4cf63' }}>{isConnected ? 'Conectada' : 'Pendiente'}</span>
                  </div>
                  <p style={{ margin: '8px 0 0', color: 'rgba(248,245,237,0.72)' }}>
                    Usuario: {saved?.username || 'Sin usuario cargado'}
                  </p>
                  <p style={{ margin: '6px 0 0', color: 'rgba(248,245,237,0.72)' }}>
                    Clave: {saved?.password ? '••••••••' : 'No guardada'}
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(248,245,237,0.62)' }}>
                    {saved?.profileUrl || 'Todavía no hay enlace guardado'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {saved?.profileUrl && (
                      <a href={saved.profileUrl} target='_blank' rel='noreferrer' style={{ color: '#74b9ff', textDecoration: 'underline', fontSize: '12px' }}>
                        Abrir perfil
                      </a>
                    )}
                    {saved && 'id' in saved && saved.id.startsWith('soc-') && (
                      <>
                        <button onClick={() => editProfile(saved)} style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.25)', color: '#f8f5ed', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
                          Editar
                        </button>
                        <button onClick={() => removeProfile(saved.id)} style={{ background: 'transparent', border: '1px solid rgba(255,143,143,0.35)', color: '#ff8f8f', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
                          Quitar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {filteredProfiles.map((acc) => (
              <div key={acc.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 140px', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                <span>{acc.platform}</span>
                <span>{acc.username}</span>
                <a href={acc.profileUrl} target='_blank' rel='noreferrer' style={{ color: '#74b9ff', textDecoration: 'underline' }}>
                  {acc.profileUrl}
                </a>
                <span style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ color: acc.status === 'connected' ? '#7dffb3' : '#f4cf63' }}>{acc.status}</span>
                  <button onClick={() => editProfile(acc)} style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: '#f8f5ed', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>
                    Editar
                  </button>
                  <button onClick={() => removeProfile(acc.id)} style={{ background: 'transparent', border: '1px solid rgba(255,143,143,0.35)', color: '#ff8f8f', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>
                    Quitar
                  </button>
                </span>
              </div>
            ))}
            {!filteredProfiles.length && (
              <div style={{ color: 'rgba(248,245,237,0.7)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
                Aun no hay perfiles cargados para este cliente.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (module.slug === 'social-crm') {
      const pipeline = [
        { stage: 'Nuevo Lead', count: 26, color: '#f4cf63' },
        { stage: 'Calificado', count: 14, color: '#7dffb3' },
        { stage: 'Propuesta', count: 7, color: '#74b9ff' },
        { stage: 'Cierre', count: 3, color: '#c39bd3' },
      ];

      const inbox = [
        { channel: 'Instagram DM', contact: 'Carla M.', sentiment: 'hot', wait: '12m' },
        { channel: 'WhatsApp Business', contact: 'Dr. Rivera', sentiment: 'warm', wait: '34m' },
        { channel: 'Facebook Inbox', contact: 'TecnoHome', sentiment: 'cold', wait: '1h 20m' },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Social CRM Pipeline</h3>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', marginBottom: '14px' }}>
            {pipeline.map((col) => (
              <div key={col.stage} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: '10px', padding: '10px' }}>
                <p style={{ margin: 0, color: '#f8f5ed', fontWeight: 700 }}>{col.stage}</p>
                <p style={{ margin: '6px 0 0', color: col.color, fontSize: '24px', fontWeight: 800 }}>{col.count}</p>
              </div>
            ))}
          </div>

          <h4 style={{ margin: '0 0 8px', color: '#f8f5ed' }}>Bandeja Social Prioritaria</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {inbox.map((msg) => (
              <div key={msg.channel + msg.contact} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 80px 80px', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                <strong>{msg.channel}</strong>
                <span>{msg.contact}</span>
                <span style={{ color: msg.sentiment === 'hot' ? '#ff8f8f' : msg.sentiment === 'warm' ? '#f4cf63' : '#bdc3c7' }}>{msg.sentiment}</span>
                <span>{msg.wait}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (module.slug === 'publication-planner') {
      const ownerEmail = typeof window !== 'undefined' ? localStorage.getItem('sb-user-email') || '' : '';
      const clientProfile = getClientProfileByEmail(ownerEmail);
      const clientSummary = {
        companyName: clientInfoDraft.companyName || clientProfile?.companyName || 'Cliente activo',
        contactName: clientInfoDraft.contactName || clientProfile?.contactName || 'Contacto pendiente',
        sector: clientInfoDraft.sector || clientProfile?.sector || 'Sector por definir',
        plan: clientInfoDraft.plan || clientProfile?.plan || 'Plan por definir',
        accountManager: clientInfoDraft.accountManager || clientProfile?.accountManager || 'Sin asignar',
      };
      const clientName = clientSummary.companyName;
      const clientNetworks = clientProfile?.managedNetworks?.length ? clientProfile.managedNetworks : ['Facebook', 'Instagram', 'TikTok', 'YouTube'];
      const monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ];
      const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const tabOptions = [
        { key: 'informacion', label: 'Información' },
        { key: 'crm', label: 'CRM' },
        { key: 'redes', label: 'Redes' },
        { key: 'calendario', label: 'Calendario' },
        { key: 'metricas', label: 'Métricas' },
        { key: 'documentos', label: 'Reportes y documentos' },
      ] as const;

      const calendarDays = Array.from({ length: 31 }, (_, idx) => idx + 1);
      const recordsByDate = records.reduce<Record<string, PortalRecord[]>>((acc, record) => {
        if (!record.dueDate) return acc;
        acc[record.dueDate] = acc[record.dueDate] || [];
        acc[record.dueDate].push(record);
        return acc;
      }, {});

      const selectedCalendarItems = selectedCalendarDay ? recordsByDate[selectedCalendarDay] || [] : [];
      const clientReports = [
        { name: 'Reporte mensual de contenido', detail: 'Resumen ejecutivo de publicaciones, aprobaciones y resultados.' },
        { name: 'Reporte social CRM', detail: 'Conversaciones activas, leads y oportunidades por canal.' },
        { name: 'Documento de marca', detail: 'Lineamientos visuales, tono y mensajes por red.' },
      ];
      const calendarFocusDate = selectedCalendarDay || module.records.find((record) => record.dueDate)?.dueDate || new Date().toISOString().slice(0, 10);
      const [calendarYear, calendarMonth] = calendarFocusDate.split('-').map(Number);
      const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
      const firstDayOffset = (new Date(calendarYear, calendarMonth - 1, 1).getDay() + 6) % 7;
      const calendarCells = [
        ...Array.from({ length: firstDayOffset }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
      ];

      const updateClientInfo = (field: keyof typeof clientInfoDraft, value: string) => {
        setClientInfoDraft((prev) => ({ ...prev, [field]: value }));
      };

      const normalizeUrl = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return '';
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      };

      const seedProfile = (platform: string) => {
        const stored = socialProfiles.find((item) => item.client === clientSummary.companyName && item.platform === platform);
        const directory = clientProfile?.networkProfiles?.find((item) => item.platform.toLowerCase() === platform.toLowerCase());
        return stored || (directory
          ? {
              id: `seed-${platform.toLowerCase()}`,
              client: clientSummary.companyName,
              platform,
              username: directory.handle.replace(/^@/, ''),
              password: '',
              profileUrl: directory.url,
              status: 'connected' as const,
            }
          : null);
      };

      const saveSocialProfile = () => {
        const profileUrl = normalizeUrl(socialUrl);
        const username = socialUsername.trim();
        if (!profileUrl || !username) return;

        const next = {
          id: socialEditingId || `soc-${Date.now()}`,
          client: clientName,
          platform: socialPlatform,
          username,
          password: socialPassword,
          profileUrl,
          status: 'connected' as const,
        };

        setSocialProfiles((prev) => {
          const withoutCurrent = prev.filter((item) => item.id !== next.id && !(item.client === clientName && item.platform === socialPlatform));
          return [next, ...withoutCurrent];
        });
        setSocialEditingId(null);
        setSocialUsername('');
        setSocialPassword('');
        setSocialUrl('');
      };

      const editSocialProfile = (profile: SocialProfile) => {
        setSocialPlatform(profile.platform);
        setSocialUsername(profile.username);
        setSocialPassword(profile.password);
        setSocialUrl(profile.profileUrl.replace(/^https?:\/\//i, ''));
        setSocialEditingId(profile.id.startsWith('seed-') ? null : profile.id);
      };

      const removeSocialProfile = (id: string) => {
        setSocialProfiles((prev) => prev.filter((item) => item.id !== id));
      };

      const renderTabButton = (key: typeof clientTab, label: string) => (
        <button
          key={key}
          onClick={() => setClientTab(key)}
          style={{
            background: clientTab === key ? '#f4cf63' : 'rgba(0,0,0,0.18)',
            color: clientTab === key ? '#0b0b0b' : '#f8f5ed',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '999px',
            padding: '9px 12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      );

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Portal del Cliente</h3>
          <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)' }}>
            Todo está en español, separado por pestañas, editable y ahora ligado al perfil real del cliente activo.
          </p>

          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
              <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Cliente activo</h4>
              <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Empresa:</strong> {clientSummary.companyName}</p>
              <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Contacto:</strong> {clientSummary.contactName}</p>
              <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Sector:</strong> {clientSummary.sector}</p>
              <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Plan:</strong> {clientSummary.plan}</p>
              <p style={{ margin: 0, color: '#f8f5ed' }}><strong>Account Manager:</strong> {clientSummary.accountManager}</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
              <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Contexto operativo</h4>
              <p style={{ margin: '0 0 6px', color: 'rgba(248,245,237,0.72)' }}>
                La información de cada pestaña se adapta al cliente seleccionado para evitar bloques genéricos.
              </p>
              <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}>Redes priorizadas: {clientNetworks.join(', ')}</p>
              <p style={{ margin: 0, color: '#f4cf63' }}>Enfoque sugerido: personalizar contenido, accesos y calendario según el sector.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {tabOptions.map((tab) => renderTabButton(tab.key, tab.label))}
          </div>

          {clientTab === 'informacion' && (
            <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Editar datos reales del cliente</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {(
                    [
                      ['companyName', 'Empresa'],
                      ['contactName', 'Contacto'],
                      ['sector', 'Sector'],
                      ['plan', 'Plan'],
                      ['accountManager', 'Account Manager'],
                    ] as const
                  ).map(([field, label]) => (
                    <label key={field} style={{ display: 'grid', gap: '6px', color: '#f8f5ed' }}>
                      <span>{label}</span>
                      <input
                        value={clientInfoDraft[field]}
                        onChange={(e) => updateClientInfo(field, e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      />
                    </label>
                  ))}
                </div>
                <p style={{ margin: '10px 0 0', color: 'rgba(248,245,237,0.72)', fontSize: '12px' }}>
                  Los cambios quedan guardados en el navegador para que cada cliente conserve su propio contexto.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Acceso visual del cliente</h4>
                <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Empresa:</strong> {clientSummary.companyName}</p>
                <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Contacto:</strong> {clientSummary.contactName}</p>
                <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Sector:</strong> {clientSummary.sector}</p>
                <p style={{ margin: '0 0 6px', color: '#f8f5ed' }}><strong>Plan:</strong> {clientSummary.plan}</p>
                <p style={{ margin: 0, color: '#f8f5ed' }}><strong>Account Manager:</strong> {clientSummary.accountManager}</p>
              </div>
            </div>
          )}

          {clientTab === 'crm' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>CRM de {clientSummary.companyName}</h4>
                <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)' }}>
                  Seguimiento de oportunidades y actividad alineado con el sector {clientSummary.sector}.
                </p>
                <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                  {metrics.map((metric) => (
                    <div key={metric.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                      <p style={{ margin: 0, color: 'rgba(248,245,237,0.72)', fontSize: '12px' }}>{metric.label}</p>
                      <p style={{ margin: '4px 0', fontSize: '24px', fontWeight: 800 }}>{metric.value}</p>
                      <p style={{ margin: 0, color: '#f4cf63', fontSize: '12px' }}>{metric.trend || 'Sin variación'}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(212,175,55,0.08)', color: '#f8f5ed' }}>
                      <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Título</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Propietario</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Vence</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Prioridad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => {
                      const statusStyle = getStatusStyle(record.status);
                      return (
                        <tr key={record.id} style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                          <td style={{ padding: '12px', color: '#f4cf63', fontWeight: 600 }}>{record.id}</td>
                          <td style={{ padding: '12px', color: '#f8f5ed' }}>{record.title}</td>
                          <td style={{ padding: '12px', color: 'rgba(248,245,237,0.84)' }}>{record.owner}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
                              {record.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: 'rgba(248,245,237,0.84)' }}>{record.dueDate || '-'}</td>
                          <td style={{ padding: '12px', color: 'rgba(248,245,237,0.84)', textTransform: 'capitalize' }}>{record.priority || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {clientTab === 'redes' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', color: '#f8f5ed' }}>
                <h4 style={{ marginTop: 0 }}>Cuentas vinculadas a {clientSummary.companyName}</h4>
                <p style={{ margin: 0, color: 'rgba(248,245,237,0.72)' }}>
                  Aquí se guarda usuario, clave y enlace de cada red con el nombre real del cliente.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px' }}>
                {clientNetworks.map((network) => {
                  const saved = seedProfile(network);
                  return (
                    <div key={network} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(212,175,55,0.12)', color: '#f8f5ed' }}>
                      <strong>{network}</strong>
                      <p style={{ margin: '8px 0 0', color: 'rgba(248,245,237,0.72)' }}>Usuario: {saved?.username || 'Sin usuario'}</p>
                      <p style={{ margin: '6px 0 0', color: 'rgba(248,245,237,0.72)' }}>Clave: {saved?.password ? '••••••••' : 'Sin definir'}</p>
                      <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(248,245,237,0.62)' }}>{saved?.profileUrl || 'Sin enlace'}</p>
                      {saved?.profileUrl && (
                        <a href={saved.profileUrl} target='_blank' rel='noreferrer' style={{ color: '#74b9ff', textDecoration: 'underline', fontSize: '12px' }}>
                          Abrir perfil
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Editar conexión por red</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px', marginBottom: '12px' }}>
                  <select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }}>
                    {clientNetworks.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
                  </select>
                  <input value={socialUsername} onChange={(e) => setSocialUsername(e.target.value)} placeholder='Usuario' style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }} />
                  <input value={socialPassword} onChange={(e) => setSocialPassword(e.target.value)} placeholder='Clave o token' type='password' style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }} />
                  <input value={socialUrl} onChange={(e) => setSocialUrl(e.target.value)} placeholder='Enlace del perfil' style={{ background: 'rgba(0,0,0,0.22)', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '8px', padding: '10px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={saveSocialProfile} style={{ background: '#f4cf63', color: '#0b0b0b', border: 'none', borderRadius: '8px', padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}>
                    {socialEditingId ? 'Actualizar conexión' : 'Guardar conexión'}
                  </button>
                  <button onClick={() => { setSocialEditingId(null); setSocialUsername(''); setSocialPassword(''); setSocialUrl(''); }} style={{ background: 'transparent', color: '#f8f5ed', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}>
                    Limpiar
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                  {socialProfiles.filter((item) => item.client === clientName).map((item) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr 140px', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                      <strong>{item.platform}</strong>
                      <span>{item.username}</span>
                      <a href={item.profileUrl} target='_blank' rel='noreferrer' style={{ color: '#74b9ff', textDecoration: 'underline' }}>{item.profileUrl}</a>
                      <span style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button onClick={() => editSocialProfile(item)} style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: '#f8f5ed', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>Editar</button>
                        <button onClick={() => removeSocialProfile(item.id)} style={{ background: 'transparent', border: '1px solid rgba(255,143,143,0.35)', color: '#ff8f8f', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>Quitar</button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {clientTab === 'calendario' && (
            <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'minmax(290px, 1.2fr) minmax(260px, 1fr)' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#f8f5ed' }}>Calendario mensual de {clientSummary.companyName}</h4>
                    <p style={{ margin: '6px 0 0', color: 'rgba(248,245,237,0.72)' }}>
                      Vista clásica del mes completo con todos los días ordenados por semana.
                    </p>
                  </div>
                  <div style={{ color: '#f4cf63', fontWeight: 800, fontSize: '18px' }}>
                    {monthNames[calendarMonth - 1]} {calendarYear}
                  </div>
                </div>
                <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)' }}>
                  Selecciona un día para ver publicaciones y aprobaciones del cliente activo.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px', marginBottom: '8px' }}>
                  {weekDays.map((day) => (
                    <div key={day} style={{ textAlign: 'center', color: '#f4cf63', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                      {day}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }}>
                  {calendarCells.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} style={{ minHeight: '78px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,175,55,0.08)' }} />;
                    }

                    const dayKey = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasContent = Boolean(recordsByDate[dayKey]?.length);
                    const active = selectedCalendarDay === dayKey;

                    return (
                      <button
                        key={dayKey}
                        onClick={() => setSelectedCalendarDay(dayKey)}
                        style={{
                          minHeight: '78px',
                          textAlign: 'left',
                          padding: '10px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          color: '#f8f5ed',
                          background: active ? '#f4cf63' : hasContent ? 'rgba(125,255,179,0.18)' : 'rgba(255,255,255,0.06)',
                          border: active ? '1px solid #f4cf63' : hasContent ? '1px solid rgba(125,255,179,0.45)' : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'grid',
                          alignContent: 'space-between',
                        }}
                      >
                        <span style={{ fontWeight: 800, fontSize: '16px', color: active ? '#0b0b0b' : '#f8f5ed' }}>{day}</span>
                        <span style={{ fontSize: '11px', color: active ? '#0b0b0b' : 'rgba(248,245,237,0.68)' }}>
                          {hasContent ? `${recordsByDate[dayKey].length} piezas` : 'Sin publicaciones'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Contenido del día</h4>
                <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)' }}>{selectedCalendarDay || 'Selecciona un día del calendario'}</p>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedCalendarItems.length ? selectedCalendarItems.map((record) => {
                    const style = getStatusStyle(record.status);
                    return (
                      <div key={record.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                        <p style={{ margin: 0, fontWeight: 700 }}>{record.title}</p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(248,245,237,0.72)' }}>{record.owner}</p>
                        <span style={{ display: 'inline-block', marginTop: '8px', background: style.bg, color: style.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 700 }}>
                          {record.status}
                        </span>
                      </div>
                    );
                  }) : (
                    <div style={{ color: 'rgba(248,245,237,0.72)', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                      No hay publicaciones para este día.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {clientTab === 'metricas' && (
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', color: '#f8f5ed' }}>
                <h4 style={{ marginTop: 0 }}>Indicadores de {clientSummary.companyName}</h4>
                <p style={{ margin: 0, color: 'rgba(248,245,237,0.72)' }}>
                  Los KPIs se presentan con el contexto del cliente y no como métricas genéricas.
                </p>
              </div>
              <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
                {metrics.map((metric, index) => (
                  <div key={metric.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ margin: 0, color: 'rgba(248,245,237,0.72)', fontSize: '12px' }}>{metric.label}</p>
                    {editMode ? (
                      <>
                        <input
                          value={metric.value}
                          onChange={(e) => setMetrics((prev) => prev.map((item, idx) => (idx === index ? { ...item, value: e.target.value } : item)))}
                          style={{ width: '100%', margin: '8px 0 6px', padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                        />
                        <input
                          value={metric.trend || ''}
                          onChange={(e) => setMetrics((prev) => prev.map((item, idx) => (idx === index ? { ...item, trend: e.target.value } : item)))}
                          placeholder='Tendencia'
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                        />
                      </>
                    ) : (
                      <>
                        <p style={{ margin: '8px 0 2px', fontSize: '28px', fontWeight: 800, color: '#f8f5ed' }}>{metric.value}</p>
                        <p style={{ margin: 0, color: '#f4cf63', fontSize: '12px' }}>{metric.trend || 'Sin variación'}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Resumen del CRM</h4>
                <p style={{ margin: 0, color: '#f8f5ed' }}>Publicaciones cargadas: {records.length}</p>
                <p style={{ margin: '6px 0 0', color: '#f8f5ed' }}>Eventos recientes: {timeline.length}</p>
                <p style={{ margin: '6px 0 0', color: '#f8f5ed' }}>Tareas del checklist: {checklist.filter((item) => item.done).length}/{checklist.length}</p>
              </div>
            </div>
          )}

          {clientTab === 'documentos' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Reportes y documentos de {clientSummary.companyName}</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {clientDocuments.map((doc) => {
                    const style = getStatusStyle(doc.status);
                    return (
                      <div key={doc.id} style={{ display: 'grid', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 100px', gap: '10px' }}>
                          <input value={doc.title} onChange={(e) => setClientDocuments((prev) => prev.map((item) => (item.id === doc.id ? { ...item, title: e.target.value } : item)))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }} />
                          <input value={doc.type} onChange={(e) => setClientDocuments((prev) => prev.map((item) => (item.id === doc.id ? { ...item, type: e.target.value } : item)))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }} />
                          <select value={doc.status} onChange={(e) => setClientDocuments((prev) => prev.map((item) => (item.id === doc.id ? { ...item, status: e.target.value as PortalRecord['status'] } : item)))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}>
                            <option value='active'>active</option>
                            <option value='pending'>pending</option>
                            <option value='review'>review</option>
                            <option value='scheduled'>scheduled</option>
                            <option value='blocked'>blocked</option>
                            <option value='completed'>completed</option>
                            <option value='draft'>draft</option>
                          </select>
                        </div>
                        <textarea value={doc.note} onChange={(e) => setClientDocuments((prev) => prev.map((item) => (item.id === doc.id ? { ...item, note: e.target.value } : item)))} style={{ minHeight: '72px', padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }} />
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <a href={doc.url} target='_blank' rel='noreferrer' style={{ color: '#74b9ff', textDecoration: 'underline', fontSize: '12px' }}>Abrir documento</a>
                          <span style={{ background: style.bg, color: style.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 700 }}>{doc.status}</span>
                          <button onClick={() => setClientDocuments((prev) => prev.filter((item) => item.id !== doc.id))} style={{ background: 'transparent', border: '1px solid rgba(255,143,143,0.35)', color: '#ff8f8f', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>
                            Quitar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                <input value={''} onChange={() => null} placeholder='Nuevo reporte (pendiente de conectar)' style={{ display: 'none' }} />
              </div>
            </div>
          )}

          <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px' }}>
            <h4 style={{ marginTop: 0, color: '#f8f5ed' }}>Resumen de publicaciones</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {records.slice(0, 5).map((record) => {
                const statusStyle = getStatusStyle(record.status);
                return (
                  <div key={record.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px', gap: '10px', alignItems: 'center', color: '#f8f5ed', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 10px' }}>
                    <strong>{record.dueDate || 'Sin fecha'}</strong>
                    <span>{record.title}</span>
                    <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: '999px', fontSize: '12px', padding: '4px 8px', textTransform: 'capitalize' }}>{record.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (module.slug === 'advertising-accounts') {
      const selectedAccount = advertisingAccounts.find((account) => account.id === selectedAdvertisingAccountId) || null;
      const filteredAdvertisingCalendar = advertisingCalendar.filter((entry) => entry.accountId === selectedAdvertisingAccountId);
      const monthDays = Array.from({ length: 31 }, (_, idx) => idx + 1);
      const scheduledDays = new Set(
        filteredAdvertisingCalendar
          .map((entry) => {
            const parsed = new Date(entry.publicationDate);
            return Number.isNaN(parsed.getTime()) ? null : parsed.getDate();
          })
          .filter((day): day is number => day !== null)
      );

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Calendario de Cuentas Publicitarias</h3>
          <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)' }}>
            Planifica y controla publicaciones por plataforma con campos editables para tipo de pieza, nombre, post publicado y estado.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            <select
              value={selectedAdvertisingAccountId}
              onChange={(e) => setSelectedAdvertisingAccountId(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
            >
              {advertisingAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {`${account.firstName || 'Sin nombre'} ${account.lastName || ''}`.trim()} · {account.sector || 'Sin sector'}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', color: '#f8f5ed', background: 'rgba(0,0,0,0.2)' }}>
              Cliente activo: {selectedAccount ? `${selectedAccount.firstName} ${selectedAccount.lastName}`.trim() : 'Sin cliente seleccionado'}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 10px', color: '#f8f5ed' }}>Vista Mensual</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(30px, 1fr))', gap: '6px' }}>
              {monthDays.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#f8f5ed',
                    background: scheduledDays.has(day) ? 'rgba(125,255,179,0.18)' : 'rgba(255,255,255,0.06)',
                    border: scheduledDays.has(day) ? '1px solid rgba(125,255,179,0.45)' : '1px solid transparent',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '10px', marginBottom: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.08)', color: '#f8f5ed' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Nombres</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Apellidos</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Profesion</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Sector</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Redes Sociales</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Edad</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Estado</th>
                  {editMode && <th style={{ textAlign: 'left', padding: '10px' }}>Accion</th>}
                </tr>
              </thead>
              <tbody>
                {advertisingAccounts.map((account) => {
                  const statusStyle = getStatusStyle(account.status);
                  return (
                    <tr key={account.id} style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={account.firstName}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'firstName', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{account.firstName}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={account.lastName}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'lastName', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{account.lastName}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={account.profession}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'profession', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{account.profession || '-'}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={account.sector}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'sector', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{account.sector || '-'}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={account.socialNetworks}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'socialNetworks', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{account.socialNetworks || '-'}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={account.age}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'age', e.target.value)}
                            style={{ width: '90px', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{account.age || '-'}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <select
                            value={account.status}
                            onChange={(e) => updateAdvertisingAccount(account.id, 'status', e.target.value)}
                            style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          >
                            <option value='active'>active</option>
                            <option value='pending'>pending</option>
                            <option value='review'>review</option>
                            <option value='scheduled'>scheduled</option>
                            <option value='blocked'>blocked</option>
                            <option value='completed'>completed</option>
                            <option value='draft'>draft</option>
                            <option value='archived'>archived</option>
                          </select>
                        ) : (
                          <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
                            {account.status}
                          </span>
                        )}
                      </td>
                      {editMode && (
                        <td style={{ padding: '10px' }}>
                          <button
                            onClick={() => removeAdvertisingAccount(account.id)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,143,143,0.45)', background: 'transparent', color: '#ff8f8f', cursor: 'pointer' }}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {!advertisingAccounts.length && (
                  <tr>
                    <td colSpan={editMode ? 8 : 7} style={{ padding: '12px', color: 'rgba(248,245,237,0.72)' }}>
                      No hay cuentas publicitarias cargadas aun.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {editMode && (
            <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '12px' }}>
              <input
                value={newAccountFirstName}
                onChange={(e) => setNewAccountFirstName(e.target.value)}
                placeholder='Nombres'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <input
                value={newAccountLastName}
                onChange={(e) => setNewAccountLastName(e.target.value)}
                placeholder='Apellidos'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <input
                value={newAccountProfession}
                onChange={(e) => setNewAccountProfession(e.target.value)}
                placeholder='Profesion'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <input
                value={newAccountSector}
                onChange={(e) => setNewAccountSector(e.target.value)}
                placeholder='Sector'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <input
                value={newAccountSocialNetworks}
                onChange={(e) => setNewAccountSocialNetworks(e.target.value)}
                placeholder='Redes sociales'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <input
                value={newAccountAge}
                onChange={(e) => setNewAccountAge(e.target.value)}
                placeholder='Edad'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <select
                value={newAccountStatus}
                onChange={(e) => setNewAccountStatus(e.target.value as PortalRecord['status'])}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              >
                <option value='draft'>draft</option>
                <option value='scheduled'>scheduled</option>
                <option value='review'>review</option>
                <option value='active'>active</option>
                <option value='completed'>completed</option>
                <option value='blocked'>blocked</option>
              </select>
              <button
                onClick={addAdvertisingAccount}
                style={{ padding: '8px 10px', borderRadius: '8px', border: 'none', background: '#f4cf63', color: '#0b0b0b', fontWeight: 700, cursor: 'pointer' }}
              >
                Guardar cuenta
              </button>
            </div>
          )}

          {editMode && (
            <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '12px' }}>
              <input
                type='date'
                value={newCalendarDate}
                onChange={(e) => setNewCalendarDate(e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <select
                value={newCalendarPlatform}
                onChange={(e) => setNewCalendarPlatform(e.target.value)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              >
                <option value='Instagram'>Instagram</option>
                <option value='Facebook'>Facebook</option>
                <option value='TikTok'>TikTok</option>
                <option value='YouTube'>YouTube</option>
                <option value='LinkedIn'>LinkedIn</option>
              </select>
              <select
                value={newCalendarType}
                onChange={(e) => setNewCalendarType(e.target.value as PublicationType)}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              >
                <option value='reel'>reel</option>
                <option value='carrusel'>carrusel</option>
                <option value='flyer'>flyer</option>
              </select>
              <input
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                placeholder='Nombre de publicacion'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <input
                value={newCalendarPost}
                onChange={(e) => setNewCalendarPost(e.target.value)}
                placeholder='Post publicado (URL o referencia)'
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              />
              <select
                value={newCalendarStatus}
                onChange={(e) => setNewCalendarStatus(e.target.value as PortalRecord['status'])}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
              >
                <option value='draft'>draft</option>
                <option value='scheduled'>scheduled</option>
                <option value='review'>review</option>
                <option value='active'>active</option>
                <option value='completed'>completed</option>
                <option value='blocked'>blocked</option>
              </select>
              <button
                onClick={addAdvertisingCalendarEntry}
                style={{ padding: '8px 10px', borderRadius: '8px', border: 'none', background: '#f4cf63', color: '#0b0b0b', fontWeight: 700, cursor: 'pointer' }}
              >
                Agregar al calendario
              </button>
            </div>
          )}

          <div style={{ overflowX: 'auto', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.08)', color: '#f8f5ed' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Fecha</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Plataforma</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Tipo</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Post Publicado</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Estado</th>
                  {editMode && <th style={{ textAlign: 'left', padding: '10px' }}>Accion</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAdvertisingCalendar.map((entry) => {
                  const statusStyle = getStatusStyle(entry.status);
                  return (
                    <tr key={entry.id} style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            type='date'
                            value={entry.publicationDate}
                            onChange={(e) => updateAdvertisingCalendarEntry(entry.id, 'publicationDate', e.target.value)}
                            style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{entry.publicationDate}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={entry.platform}
                            onChange={(e) => updateAdvertisingCalendarEntry(entry.id, 'platform', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{entry.platform}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <select
                            value={entry.publicationType}
                            onChange={(e) => updateAdvertisingCalendarEntry(entry.id, 'publicationType', e.target.value)}
                            style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          >
                            <option value='reel'>reel</option>
                            <option value='carrusel'>carrusel</option>
                            <option value='flyer'>flyer</option>
                          </select>
                        ) : (
                          <span style={{ color: '#f8f5ed', textTransform: 'capitalize' }}>{entry.publicationType}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={entry.publicationName}
                            onChange={(e) => updateAdvertisingCalendarEntry(entry.id, 'publicationName', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: '#f8f5ed' }}>{entry.publicationName}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <input
                            value={entry.publishedPost}
                            onChange={(e) => updateAdvertisingCalendarEntry(entry.id, 'publishedPost', e.target.value)}
                            style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          />
                        ) : (
                          <span style={{ color: 'rgba(248,245,237,0.84)' }}>{entry.publishedPost || '-'}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {editMode ? (
                          <select
                            value={entry.status}
                            onChange={(e) => updateAdvertisingCalendarEntry(entry.id, 'status', e.target.value)}
                            style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                          >
                            <option value='active'>active</option>
                            <option value='pending'>pending</option>
                            <option value='review'>review</option>
                            <option value='scheduled'>scheduled</option>
                            <option value='blocked'>blocked</option>
                            <option value='completed'>completed</option>
                            <option value='draft'>draft</option>
                            <option value='archived'>archived</option>
                          </select>
                        ) : (
                          <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
                            {entry.status}
                          </span>
                        )}
                      </td>
                      {editMode && (
                        <td style={{ padding: '10px' }}>
                          <button
                            onClick={() => removeAdvertisingCalendarEntry(entry.id)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,143,143,0.45)', background: 'transparent', color: '#ff8f8f', cursor: 'pointer' }}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {!filteredAdvertisingCalendar.length && (
                  <tr>
                    <td colSpan={editMode ? 7 : 6} style={{ padding: '12px', color: 'rgba(248,245,237,0.72)' }}>
                      No hay publicaciones programadas aun.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (module.slug === 'settings') {
      const toggles = [
        { key: 'emailAlerts', label: 'Email alerts' },
        { key: 'weeklySummary', label: 'Weekly summary' },
        { key: 'approvalRequired', label: 'Approval required before publish' },
        { key: 'autoPublish', label: 'Auto publish after approval' },
      ] as const;

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Configuracion Operativa</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {toggles.map((toggle) => (
              <label key={toggle.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', color: '#f8f5ed' }}>
                <span>{toggle.label}</span>
                <input
                  type='checkbox'
                  checked={settingsState[toggle.key]}
                  onChange={() => setSettingsState((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                />
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (module.slug === 'content' || module.slug === 'content-approvals') {
      const columns = [
        { name: 'Draft', items: 6 },
        { name: 'Internal Review', items: 3 },
        { name: 'Client Review', items: 5 },
        { name: 'Scheduled', items: 4 },
      ];

      return (
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Pipeline de Contenido</h3>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))' }}>
            {columns.map((col) => (
              <div key={col.name} style={{ background: 'rgba(0,0,0,0.22)', borderRadius: '10px', padding: '10px', color: '#f8f5ed' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{col.name}</p>
                <p style={{ margin: '6px 0 0', color: '#f4cf63', fontSize: '20px', fontWeight: 800 }}>{col.items}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#f4cf63' }}>{module.title}</h1>
        <p style={{ color: 'rgba(248,245,237,0.78)' }}>{module.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            style={{
              background: 'rgba(18,18,18,0.92)',
              border: '1px solid rgba(212,175,55,0.14)',
              borderRadius: '12px',
              padding: '14px',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(248,245,237,0.6)' }}>{metric.label}</p>
            {editMode ? (
              <>
                <input
                  value={metric.value}
                  onChange={(e) =>
                    setMetrics((prev) => prev.map((item, idx) => (idx === index ? { ...item, value: e.target.value } : item)))
                  }
                  style={{ width: '100%', margin: '8px 0 6px', padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                />
                <input
                  value={metric.trend || ''}
                  onChange={(e) =>
                    setMetrics((prev) => prev.map((item, idx) => (idx === index ? { ...item, trend: e.target.value } : item)))
                  }
                  placeholder='Tendencia'
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                />
              </>
            ) : (
              <>
                <p style={{ margin: '8px 0 2px', fontSize: '28px', fontWeight: 800, color: '#f8f5ed' }}>{metric.value}</p>
                <p style={{ margin: 0, color: '#f4cf63', fontSize: '12px' }}>{metric.trend || 'Sin variacion'}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={handlePrimaryAction}
          style={{
            background: '#f4cf63',
            color: '#0b0b0b',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {module.primaryAction}
        </button>
        <button
          onClick={handleSecondaryAction}
          style={{
            background: 'transparent',
            color: '#f8f5ed',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {module.secondaryAction}
        </button>
        <button
          onClick={() => setEditMode((prev) => !prev)}
          style={{
            background: editMode ? '#7dffb3' : 'transparent',
            color: editMode ? '#0b0b0b' : '#f8f5ed',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {editMode ? 'Modo Edicion Activo' : 'Editar Datos'}
        </button>
      </div>

      {renderAutonomousSection()}

      <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: '18px' }}>
        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Workflow</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {workflow.map((step, index) => {
              const style = getStatusStyle(step.status);
              return (
                <div key={step.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#f8f5ed' }}>{step.label}</span>
                  {editMode ? (
                    <input
                      type='number'
                      value={step.count}
                      min={0}
                      onChange={(e) =>
                        setWorkflow((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, count: Number(e.target.value) || 0 } : item))
                        )
                      }
                      style={{ width: '76px', padding: '6px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                    />
                  ) : (
                    <span style={{ background: style.bg, color: style.color, borderRadius: '999px', padding: '3px 10px', fontSize: '12px', fontWeight: 700 }}>
                      {step.count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Checklist Operativo</h3>
          <p style={{ marginTop: 0, color: 'rgba(248,245,237,0.72)', fontSize: '13px' }}>
            Completado: {doneCount}/{checklist.length}
          </p>
          <div style={{ display: 'grid', gap: '8px' }}>
            {checklist.map((item) => (
              <label key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#f8f5ed' }}>
                <input type='checkbox' checked={item.done} onChange={() => toggleChecklist(item.id)} />
                <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>{item.title}</span>
              </label>
            ))}
            {editMode && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder='Nueva tarea checklist'
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                />
                <button onClick={addChecklistItem} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#f4cf63', color: '#0b0b0b', fontWeight: 700, cursor: 'pointer' }}>
                  Agregar
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px' }}>
          <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Timeline</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {timeline.map((event) => (
              <div key={event.id} style={{ borderLeft: '2px solid rgba(212,175,55,0.28)', paddingLeft: '10px' }}>
                {editMode ? (
                  <>
                    <input
                      value={event.title}
                      onChange={(e) => updateTimelineEvent(event.id, 'title', e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed', marginBottom: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        value={event.date}
                        onChange={(e) => updateTimelineEvent(event.id, 'date', e.target.value)}
                        style={{ flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      />
                      <button onClick={() => removeTimelineEvent(event.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,143,143,0.45)', background: 'transparent', color: '#ff8f8f', cursor: 'pointer' }}>
                        Quitar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ margin: 0, color: '#f8f5ed', fontWeight: 600 }}>{event.title}</p>
                    <p style={{ margin: '2px 0 0', color: 'rgba(248,245,237,0.74)', fontSize: '12px' }}>
                      {event.date} • {event.type}
                    </p>
                  </>
                )}
              </div>
            ))}
            {editMode && (
              <div style={{ display: 'grid', gap: '8px', marginTop: '6px' }}>
                <input
                  value={newTimelineTitle}
                  onChange={(e) => setNewTimelineTitle(e.target.value)}
                  placeholder='Nuevo evento'
                  style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={newTimelineDate}
                    onChange={(e) => setNewTimelineDate(e.target.value)}
                    placeholder='YYYY-MM-DD HH:mm'
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                  />
                  <select
                    value={newTimelineType}
                    onChange={(e) => setNewTimelineType(e.target.value as 'meeting' | 'delivery' | 'approval' | 'note')}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                  >
                    <option value='meeting'>meeting</option>
                    <option value='delivery'>delivery</option>
                    <option value='approval'>approval</option>
                    <option value='note'>note</option>
                  </select>
                  <button onClick={addTimelineEvent} style={{ padding: '8px 10px', borderRadius: '8px', border: 'none', background: '#f4cf63', color: '#0b0b0b', fontWeight: 700, cursor: 'pointer' }}>
                    Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
        <h3 style={{ marginTop: 0, color: '#f4cf63' }}>Acciones Rapidas</h3>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '10px',
                textAlign: 'left',
                color: '#f8f5ed',
                padding: '10px',
                cursor: 'pointer',
              }}
              title={action.hint}
            >
              <strong style={{ display: 'block' }}>{action.label}</strong>
              <span style={{ fontSize: '12px', color: 'rgba(248,245,237,0.7)' }}>{action.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Buscar por id, titulo, owner o estado'
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#f8f5ed',
            borderRadius: '8px',
            padding: '10px 12px',
            outline: 'none',
          }}
          aria-label='Buscar registros de gestion'
        />
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
          <thead>
            <tr style={{ background: 'rgba(212,175,55,0.08)', color: '#f8f5ed' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Titulo</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Owner</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Estado</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Vence</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Prioridad</th>
              {editMode && <th style={{ textAlign: 'left', padding: '12px' }}>Accion</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => {
              const statusStyle = getStatusStyle(record.status);
              return (
                <tr key={record.id} style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                  <td style={{ padding: '12px', color: '#f4cf63', fontWeight: 600 }}>{record.id}</td>
                  <td style={{ padding: '12px', color: '#f8f5ed' }}>
                    {editMode ? (
                      <input
                        value={record.title}
                        onChange={(e) => updateRecord(record.id, 'title', e.target.value)}
                        style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      />
                    ) : record.title}
                  </td>
                  <td style={{ padding: '12px', color: 'rgba(248,245,237,0.84)' }}>
                    {editMode ? (
                      <input
                        value={record.owner}
                        onChange={(e) => updateRecord(record.id, 'owner', e.target.value)}
                        style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      />
                    ) : record.owner}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editMode ? (
                      <select
                        value={record.status}
                        onChange={(e) => updateRecord(record.id, 'status', e.target.value)}
                        style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      >
                        <option value='active'>active</option>
                        <option value='pending'>pending</option>
                        <option value='review'>review</option>
                        <option value='scheduled'>scheduled</option>
                        <option value='blocked'>blocked</option>
                        <option value='completed'>completed</option>
                        <option value='draft'>draft</option>
                        <option value='archived'>archived</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          display: 'inline-block',
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: '12px',
                          borderRadius: '999px',
                          padding: '4px 10px',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {record.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', color: 'rgba(248,245,237,0.84)' }}>
                    {editMode ? (
                      <input
                        type='date'
                        value={record.dueDate || ''}
                        onChange={(e) => updateRecord(record.id, 'dueDate', e.target.value)}
                        style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      />
                    ) : (record.dueDate || '-')}
                  </td>
                  <td style={{ padding: '12px', color: 'rgba(248,245,237,0.84)', textTransform: 'capitalize' }}>
                    {editMode ? (
                      <select
                        value={record.priority || 'medium'}
                        onChange={(e) => updateRecord(record.id, 'priority', e.target.value)}
                        style={{ padding: '7px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'rgba(0,0,0,0.35)', color: '#f8f5ed' }}
                      >
                        <option value='low'>low</option>
                        <option value='medium'>medium</option>
                        <option value='high'>high</option>
                      </select>
                    ) : (record.priority || '-')}
                  </td>
                  {editMode && (
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => removeRecord(record.id)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,143,143,0.45)', background: 'transparent', color: '#ff8f8f', cursor: 'pointer' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={editMode ? 7 : 6} style={{ padding: '14px', color: 'rgba(248,245,237,0.7)' }}>
                  Sin resultados para la busqueda actual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '12px', color: 'rgba(248,245,237,0.7)', fontSize: '12px' }}>
        Resumen de estados: {Object.entries(statusSummary).map(([status, count]) => `${status}: ${count}`).join(' · ')}
      </div>
    </div>
  );
}
