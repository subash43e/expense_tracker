import Spinner from '@components/common/Spinner';

export default function ExpensesLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" color="indigo" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading expenses...</p>
      </div>
    </div>
  );
}
