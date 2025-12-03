import { Bell, HardHat, MapPin, Navigation, User } from 'lucide-react';

const Header = ({ location, onLocationRequest }) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-3 rounded-2xl">
              <HardHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Weather AI Mining
              </h1>
              <p className="text-xs text-gray-400 hidden md:block">
                Smart weather predictions for mining operations
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            {location ? (
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-400" />
                <div className="text-sm">
                  <div className="text-white font-medium">Active</div>
                  <div className="text-gray-400 text-xs">
                    {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onLocationRequest}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span className="text-sm">Enable Location</span>
              </button>
            )}

            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/10 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* User */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;