interface ParkingStatusProps {
  type: 'success' | 'error';
  message: string;
}

export default function ParkingStatus({ type, message }: ParkingStatusProps) {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <div className={`mb-6 p-4 rounded-md border ${bgColor} ${borderColor}`}>
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
} 