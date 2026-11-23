import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_DESCRIPTIONS: Record<string, string> = {
  '/': 'SK Tape Ball Academy — Build Your Game. Master Your Skills. Structured tape ball cricket coaching, programs, coaching staff, schedules, and player admissions.',
  '/about':
    'Learn about SK Tape Ball Academy, our mission, vision, coaching philosophy, values, and four-stage player development pathway.',
  '/programs':
    'Explore 9 specialized SK Tape Ball Academy training tracks covering batting, fast bowling, spin bowling, fielding, wicket keeping, fitness, beginner, advanced, and 1-on-1 coaching.',
  '/coaches':
    'Meet the coaching leadership and specialist skill coaches at SK Tape Ball Academy.',
  '/facilities':
    'Inspect training lanes, floodlit practice pitches, agility zones, and match simulation facilities at SK Tape Ball Academy.',
  '/schedule':
    'View structured weekly training schedule templates and program categories at SK Tape Ball Academy.',
  '/matches':
    'Follow upcoming academy matches, inter-batch challenges, and tape ball cricket events.',
  '/achievements':
    'Explore player development milestones and academy recognition highlights at SK Tape Ball Academy.',
  '/gallery':
    'Browse training photos and video highlight clips from SK Tape Ball Academy.',
  '/admissions':
    'Step-by-step admissions guide, eligibility overview, required details, and registration instructions.',
  '/fees':
    'Review fee structure placeholders, admission policy notes, and training package options.',
  '/faqs':
    'Find answers to common questions on age groups, free trials, equipment, safety, and admissions.',
  '/contact':
    'Contact SK Tape Ball Academy for admissions inquiries, training questions, and official venue placeholders.',
  '/register':
    'Complete the SK Tape Ball Academy student admission registration form with guardian consent and program preferences.',
  '/book-trial':
    'Submit a free tape ball cricket evaluation trial request at SK Tape Ball Academy.',
  '/login': 'Sign in to the SK Tape Ball Academy member and guardian portal.',
  '/forgot-password': 'Preview password recovery instructions for SK Tape Ball Academy accounts.',
  '/reset-password': 'Create a strong new password for your SK Tape Ball Academy account.',
  '/registration-confirmation':
    'SK Tape Ball Academy registration confirmation demonstration screen and next steps.',
  '/application-status':
    'Track your SK Tape Ball Academy admission application status across all five review stages.',
};

const DEFAULT_DESCRIPTION =
  'SK Tape Ball Academy — Build Your Game. Master Your Skills. Structured tape ball cricket coaching and player development.';

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
      pathname.startsWith('/admin') || pathname === '/reset-password';

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
