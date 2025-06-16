import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Builds',
  description: 'A collection of projects and products built by Declan Kramper',
};

export default function BuildsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 