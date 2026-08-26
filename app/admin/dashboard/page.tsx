'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  name: string;
  company: string;
  email: string;
  projectType: string;
  message: string;
  read: boolean;
  createdAt: string;
  deliveryStatus?: string;
  repliedAt?: string;
}

const READ_KEY = 'mostafa-admin-read-message-ids';
const ARCHIVED_KEY = 'mostafa-admin-archived-message-ids';
const REPLIED_KEY = 'mostafa-admin-replied-message-ids';

function readStringArray(key: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function readReplyMap(): Record<string, string> {
  try {
    const value = JSON.parse(localStorage.getItem(REPLIED_KEY) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

function applyLocalState(messages: Message[]): Message[] {
  const readIds = new Set(readStringArray(READ_KEY));
  const archivedIds = new Set(readStringArray(ARCHIVED_KEY));
  const replies = readReplyMap();
  return messages
    .filter((message) => !archivedIds.has(message.id))
    .map((message) => ({
      ...message,
      read: readIds.has(message.id),
      repliedAt: replies[message.id],
    }));
}

export default function AdminDashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);

  const handleInboxResponse = useCallback(
    async (response: Response) => {
      if (response.status === 401) {
        router.replace('/admin');
        return;
      }
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'The inbox could not be loaded.');
      }
      setMessages(applyLocalState(data.messages));
    },
    [router]
  );

  useEffect(() => {
    let active = true;
    fetch('/api/admin/messages', { cache: 'no-store' })
      .then((response) => (active ? handleInboxResponse(response) : undefined))
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Inbox error.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [handleInboxResponse]);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      await handleInboxResponse(await fetch('/api/admin/messages', { cache: 'no-store' }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Inbox error.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    const ids = new Set(readStringArray(READ_KEY));
    ids.add(id);
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
    setMessages((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const archiveMessage = (id: string) => {
    if (!window.confirm('Archive this message on this device?')) return;
    const ids = new Set(readStringArray(ARCHIVED_KEY));
    ids.add(id);
    localStorage.setItem(ARCHIVED_KEY, JSON.stringify([...ids]));
    setMessages((current) => current.filter((item) => item.id !== id));
    setExpandedId(null);
  };

  const toggleExpand = async (message: Message) => {
    if (expandedId === message.id) {
      setExpandedId(null);
      setReplyingId(null);
      return;
    }
    setExpandedId(message.id);
    setReplyingId(null);
    setReplyStatus('');
    setReplySubject(`Re: ${message.projectType} inquiry`);
    setReplyMessage('');
    if (!message.read) markAsRead(message.id);

    if (!message.message) {
      setLoadingMessageId(message.id);
      try {
        const response = await fetch(`/api/admin/messages/${message.id}`, { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Message could not be loaded.');
        setMessages((current) =>
          current.map((item) =>
            item.id === message.id
              ? { ...data.message, read: true, repliedAt: item.repliedAt }
              : item
          )
        );
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Message could not be loaded.');
      } finally {
        setLoadingMessageId(null);
      }
    }
  };

  const sendReply = async (message: Message) => {
    setSendingReply(true);
    setReplyStatus('');
    try {
      const response = await fetch(`/api/admin/messages/${message.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Reply failed.');

      const replies = readReplyMap();
      replies[message.id] = data.repliedAt;
      localStorage.setItem(REPLIED_KEY, JSON.stringify(replies));
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, repliedAt: data.repliedAt } : item
        )
      );
      setReplyStatus(data.message);
      setReplyMessage('');
    } catch (replyError) {
      setReplyStatus(replyError instanceof Error ? replyError.message : 'Reply failed.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin');
  };

  const unreadCount = messages.filter((message) => !message.read).length;
  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        if (filter === 'unread') return !message.read;
        if (filter === 'read') return message.read;
        return true;
      }),
    [filter, messages]
  );

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">Inbox</h1>
            <span className="text-xs text-sage bg-flight-950 px-2.5 py-1 rounded-full border border-line">{unreadCount} unread</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-sage hover:text-mist">View site</Link>
            <button onClick={handleLogout} className="text-xs text-sage hover:text-white px-3 py-1.5 border border-line rounded-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            ['Total messages', messages.length],
            ['Unread', unreadCount],
            ['Replied', messages.filter((message) => message.repliedAt).length],
          ].map(([label, value]) => (
            <div key={String(label)} className="p-5 border border-line rounded-sm bg-obsidian/40">
              <p className="text-xs text-sage uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-6 border-b border-line">
          {(['all', 'unread', 'read'] as const).map((value) => (
            <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2.5 text-sm capitalize border-b-2 -mb-px ${filter === value ? 'text-white border-runway' : 'text-sage border-transparent hover:text-mist'}`}>{value}</button>
          ))}
          <button onClick={refresh} disabled={loading} className="ml-auto text-xs text-sage hover:text-white p-2 disabled:opacity-50">{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>

        {error && <div role="alert" className="mb-6 p-4 text-sm text-red-300 border border-red-400/30 bg-red-400/10 rounded-sm">{error}</div>}

        {loading && messages.length === 0 ? (
          <div className="py-20 text-center text-sage">Loading inbox…</div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-20 text-center text-sage text-sm">No {filter === 'all' ? '' : `${filter} `}messages.</div>
        ) : (
          <div className="space-y-2">
            {filteredMessages.map((message) => (
              <article key={message.id} className={`border rounded-sm ${message.read ? 'border-line bg-obsidian/30' : 'border-runway/30 bg-flight-950/50'}`}>
                <button onClick={() => toggleExpand(message)} className="w-full text-left px-5 py-4 flex items-center gap-4">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${message.read ? 'bg-transparent' : 'bg-runway'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${message.read ? 'text-mist' : 'text-white font-semibold'}`}>{message.name}</span>
                      {message.company && <span className="text-xs text-sage truncate hidden sm:inline">— {message.company}</span>}
                      {message.repliedAt && <span className="text-[10px] uppercase tracking-wider text-runway">Replied</span>}
                    </div>
                    <p className="text-xs text-sage truncate mt-0.5">{message.message || 'Open to read this inquiry'}</p>
                  </div>
                  <span className="hidden md:inline text-xs text-sage border border-line px-2 py-0.5 rounded-full">{message.projectType}</span>
                  <time className="text-xs text-sage whitespace-nowrap">{formatDate(message.createdAt)}</time>
                </button>

                {expandedId === message.id && (
                  <div className="px-5 pb-5 border-t border-line mx-5 pt-4">
                    {loadingMessageId === message.id ? (
                      <div className="py-10 text-center text-sm text-sage">Loading message…</div>
                    ) : (
                      <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div><p className="text-xs text-sage uppercase mb-1">Email</p><a href={`mailto:${message.email}`} className="text-sm text-runway hover:underline">{message.email}</a></div>
                      <div><p className="text-xs text-sage uppercase mb-1">Received</p><p className="text-sm text-mist">{new Date(message.createdAt).toLocaleString()}</p></div>
                    </div>
                    <div className="p-4 bg-flight-950/80 border border-line rounded-sm mb-5"><p className="text-sm text-mist whitespace-pre-wrap leading-relaxed">{message.message}</p></div>

                    {replyingId === message.id ? (
                      <form onSubmit={(event) => { event.preventDefault(); sendReply(message); }} className="space-y-4 border border-runway/20 bg-flight-950/40 p-4 rounded-sm">
                        <div>
                          <label htmlFor={`subject-${message.id}`} className="block text-xs text-sage uppercase mb-1.5">Subject</label>
                          <input id={`subject-${message.id}`} value={replySubject} onChange={(event) => setReplySubject(event.target.value)} required maxLength={200} className="w-full px-3 py-2.5 bg-carbon border border-line text-white text-sm rounded-sm focus:outline-none focus:border-runway" />
                        </div>
                        <div>
                          <label htmlFor={`reply-${message.id}`} className="block text-xs text-sage uppercase mb-1.5">Reply to {message.name}</label>
                          <textarea id={`reply-${message.id}`} value={replyMessage} onChange={(event) => setReplyMessage(event.target.value)} required maxLength={10000} rows={6} placeholder="Write your reply…" className="w-full px-3 py-2.5 bg-carbon border border-line text-white text-sm rounded-sm resize-y focus:outline-none focus:border-runway" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <button type="submit" disabled={sendingReply} className="px-4 py-2 bg-white text-carbon font-semibold text-xs rounded-sm disabled:opacity-50">{sendingReply ? 'Sending…' : 'Send with Resend'}</button>
                          <button type="button" onClick={() => setReplyingId(null)} className="px-4 py-2 text-xs text-sage border border-line rounded-sm">Cancel</button>
                          {replyStatus && <p role="status" className="text-xs text-runway">{replyStatus}</p>}
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button onClick={() => { setReplyingId(message.id); setReplyStatus(''); }} className="px-4 py-2 text-xs text-runway border border-runway/30 rounded-sm hover:border-runway">Reply by email</button>
                        <button onClick={() => archiveMessage(message.id)} className="ml-auto px-3 py-1.5 text-xs text-sage border border-line rounded-sm hover:text-white">Archive</button>
                      </div>
                    )}
                      </>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
