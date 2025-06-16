import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Professional resume and contact information for Declan Kramper',
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 