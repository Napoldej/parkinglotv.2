import { useState, useEffect } from 'react';

interface ParkingLotFormProps {
  onCreateParkingLot: () => void;
  onDeleteParkingLot: () => void;
}

interface ParkingLot {
  id: string;
}

export default function ParkingLotForm({ onCreateParkingLot, onDeleteParkingLot }: ParkingLotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [parkingLot, setParkingLot] = useState<ParkingLot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchParkingLot = async () => {
    try {
      const response = await fetch('/api/parkingLot/');
      const data = await response.json();
      console.log('Fetch response:', { status: response.status, data });

      if (Array.isArray(data) && data.length > 0) {
        setParkingLot(data[0]); 
      } else {
        setParkingLot(null);
      }
    } catch (err) {
      console.error('Error fetching parking lot:', err);
      setParkingLot(null);
    }
  };

  useEffect(() => {
    fetchParkingLot();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parkingLot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log('Create response:', { status: response.status, data });

      if (response.ok && data?.id) {
        setParkingLot(data);
        onCreateParkingLot();
      } else {
        setError(data?.message || 'Failed to create parking lot');
      }
    } catch (err) {
      console.error('Error creating parking lot:', err);
      setError('Failed to create parking lot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!parkingLot?.id) return;

    const confirmDelete = window.confirm('Are you sure you want to delete the parking lot? This will remove all parking data.');
    if (!confirmDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/parkingLot/${parkingLot.id}`, {
        method: 'DELETE',
      });

      console.log('Delete response:', { status: response.status });

      if (response.ok) {
        setParkingLot(null);
        onDeleteParkingLot();
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('Failed to delete parking lot:', errorData);
        setError('Failed to delete parking lot');
      }
    } catch (err) {
      console.error('Error deleting parking lot:', err);
      setError('Error deleting parking lot');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="submit"
          disabled={isLoading || isDeleting || !!parkingLot?.id}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading
            ? 'Creating...'
            : parkingLot?.id
            ? 'Parking Lot Already Exists'
            : 'Initialize Parking Lot'}
        </button>
      </form>

      <button
        onClick={handleDelete}
        disabled={isLoading || isDeleting || !parkingLot?.id}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete Parking Lot'}
      </button>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {parkingLot?.id && (
        <div className="text-sm text-gray-500">Parking Lot ID: {parkingLot.id}</div>
      )}
    </div>
  );
}
