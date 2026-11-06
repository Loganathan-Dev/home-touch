import AddPropertyPage from '../page';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AddPropertyPage editId={resolvedParams.id} />;
}