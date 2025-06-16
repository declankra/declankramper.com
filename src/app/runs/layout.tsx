import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Runs',
  description: 'Running journey in words and numbers',
};

export default function RunsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 