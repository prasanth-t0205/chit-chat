const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="h-full relative flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-12 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md text-white">
        <div className="mb-12">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 
                  ${i % 3 === 0 ? "animate-pulse" : ""}
                  hover:scale-105 transition-transform duration-300
                `}
              />
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-lg text-white/80">{subtitle}</p>

          <div className="flex justify-center gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
