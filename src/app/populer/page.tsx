import { redirect } from 'next/navigation';

export default function PopulerPage() {
  redirect('/browse?sort=populer');
}
