function Welcome() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Welcome to Our Application
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl text-center">
          {
            'This is a application designed to management your tasks efficiently and effectively. Explore the features and get started on your productivity journey!'
          }
        </p>
      </div>
    </>
  );
}

export default Welcome;
