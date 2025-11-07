import TripForm from '../TripForm';

export default function TripFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return <TripForm onSubmit={handleSubmit} />;
}
