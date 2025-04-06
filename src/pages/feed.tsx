import PageHeader from '@/components/page-header';

const Feed = () => {
  return (
    <>
      <PageHeader />
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Feed</h1>
            <p className="text-muted-foreground">View and manage your segment feed</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
          <p className="text-muted-foreground mb-6 max-w-md">Feed content will appear here.</p>
        </div>
      </div>
    </>
  );
};

export default Feed;
