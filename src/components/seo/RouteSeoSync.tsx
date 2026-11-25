import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_DESCRIPTIONS: Record<string, string> = {
  '/': 'SK Tape Ball Academy — Where Dreams Meet Opportunities. Structured tape ball cricket coaching in Sabzazar, Lahore.',
  '/about':
    'Learn about SK Tape Ball Academy, founded by Sami Khan in Faisalabad on 18 August 2024 and operating in Sabzazar, Lahore.',
  '/programs':
    'Explore structured tape ball cricket coaching covering fitness (~200 exercises), batting assessment and practice methods, bowling accuracy, and fielding.',
  '/coaches':
    'Coaching staff directory for SK Tape Ball Academy in Sabzazar, Lahore.',
  '/facilities':
    'Explore training environment, discipline standards, and practice setup at SK Tape Ball Academy.',
  '/schedule':
    'Weekly training overview and inquiry guidance for SK Tape Ball Academy.',
  '/matches':
    'Tape ball leagues, single-wicket competitions, and academy event updates at SK Tape Ball Academy.',
  '/achievements':
    'Verified academy milestones and player highlights at SK Tape Ball Academy.',
  '/gallery':
    'Training session visuals and academy highlights from SK Tape Ball Academy.',
  '/admissions':
    'Step-by-step admissions guide, onboarding requirements, and registration instructions.',
  '/fees':
    'Fee inquiry and membership guidance for SK Tape Ball Academy.',
  '/faqs':
    'Answers to common questions on admissions, training disciplines, free trials, and policies.',
  '/contact':
    'Contact SK Tape Ball Academy in Sabzazar, Lahore for admissions inquiries and free trials.',
  '/register':
    'Submit a student admission inquiry to SK Tape Ball Academy with guardian consent where required.',
  '/book-trial':
    'Submit a free tape ball cricket evaluation trial request at SK Tape Ball Academy.',
  '/login': 'Sign in to the SK Tape Ball Academy member and guardian portal.',
  '/forgot-password': 'Password recovery instructions for SK Tape Ball Academy member accounts.',
  '/reset-password': 'Set a new password for your SK Tape Ball Academy account.',
  '/registration-confirmation':
    'SK Tape Ball Academy admission inquiry summary and next steps.',
  '/application-status':
    'Check your SK Tape Ball Academy admission inquiry review status.',
};

const DEFAULT_DESCRIPTION =
  'SK Tape Ball Academy — Where Dreams Meet Opportunities. Structured tape ball cricket coaching in Sabzazar, Lahore.';

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function RouteSeoSync() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdminOrSensitive =
      pathname.startsWith('/sk-portal') ||
      pathname.startsWith('/admin') ||
      pathname === '/reset-password';

    const description = ROUTE_DESCRIPTIONS[pathname] ?? DEFAULT_DESCRIPTION;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${pathname}`;

    upsertMetaTag('name', 'description', description);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:title', document.title);
    upsertMetaTag('name', 'twitter:title', document.title);
    upsertMetaTag(
      'name',
      'robots',
      isAdminOrSensitive ? 'noindex, nofollow' : 'index, follow',
    );
    upsertCanonical(canonicalUrl);
  }, [pathname]);

  return null;
}
