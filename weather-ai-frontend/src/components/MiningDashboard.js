import { AlertTriangle, Clock, HardHat, Shield, TrendingUp, Truck } from 'lucide-react';

const MiningDashboard = ({ weatherData }) => {
  if (!weatherData || !weatherData.mining_recommendations) return null;
  
  const miningData = weatherData.mining_recommendations;
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'DARURAT': return 'from-red-500 to-pink-500';
      case 'WASPADA TINGGI': return 'from-orange-500 to-red-500';
      case 'WASPADA': return 'from-yellow-500 to-orange-500';
      case 'CAUTION': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'DARURAT': return '🛑';
      case 'WASPADA TINGGI': return '⚠️';
      case 'WASPADA': return '⚠️';
      case 'CAUTION': return 'ℹ️';
      default: return '✅';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`bg-gradient-to-r ${getStatusColor(miningData.status)} bg-opacity-20 border border-white/20 rounded-3xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{getStatusIcon(miningData.status)}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mining Operations Status</h2>
              <p className="text-gray-300">Based on current weather conditions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{miningData.productivity_score}%</div>
            <div className="text-gray-300">Productivity Score</div>
          </div>
        </div>
      </div>
      
      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <HardHat className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Operational Recommendations</h3>
          </div>
          
          <div className="space-y-4">
            {miningData.recommendations?.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-2xl">
                <div className="text-2xl">
                  {rec.includes('🛑') ? '🛑' : 
                   rec.includes('⚠️') ? '⚠️' : 
                   rec.includes('ℹ️') ? 'ℹ️' : '✅'}
                </div>
                <div>
                  <div className="text-gray-300">{rec}</div>
                  {rec.includes('angkut barang') && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-amber-400">
                      <Truck className="w-4 h-4" />
                      <span>Material transportation affected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats & Alerts */}
        <div className="space-y-6">
          {/* Operational Hours */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Safe Operational Hours</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-2xl">
                <div className="text-sm text-gray-400">Day Shift</div>
                <div className="text-3xl font-bold text-white">{miningData.operational_hours?.day_shift || 8}h</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-2xl">
                <div className="text-sm text-gray-400">Night Shift</div>
                <div className="text-3xl font-bold text-white">{miningData.operational_hours?.night_shift || 8}h</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-2xl">
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-3xl font-bold text-white">{miningData.operational_hours?.total || 16}h</div>
              </div>
            </div>
          </div>
          
          {/* Alerts */}
          {miningData.alerts && miningData.alerts.length > 0 && (
            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl border border-red-500/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                <h3 className="text-xl font-bold text-white">Safety Alerts</h3>
              </div>
              <div className="space-y-3">
                {miningData.alerts.map((alert, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-white/5 rounded-xl">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-200">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Productivity Meter */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-3xl border border-green-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Productivity Analysis</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Current Productivity</span>
                  <span>{miningData.productivity_score}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${
                      miningData.productivity_score > 70 ? 'from-green-500 to-emerald-500' :
                      miningData.productivity_score > 40 ? 'from-yellow-500 to-orange-500' :
                      'from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${miningData.productivity_score}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {miningData.productivity_score > 70 ? 'High productivity expected' :
                 miningData.productivity_score > 40 ? 'Moderate productivity' :
                 'Low productivity expected'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Equipment Recommendations */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Equipment & Safety Guidelines</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">🔄</div>
              <div className="font-bold text-white">Excavator Operations</div>
            </div>
            <p className="text-gray-400 text-sm">
              {weatherData.rainfall > 10 
                ? 'Use rock bucket for wet material. Monitor ground stability.'
                : 'Optimal conditions for excavation. Maximize cycle efficiency.'}
            </p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">🚛</div>
              <div className="font-bold text-white">Dump Truck Operations</div>
            </div>
            <p className="text-gray-400 text-sm">
              {weatherData.rainfall > 10 
                ? 'Reduce speed 30%. Install tire chains. Check braking system.'
                : 'Full payload operations. Optimize haul routes.'}
            </p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">🚜</div>
              <div className="font-bold text-white">Dozer Operations</div>
            </div>
            <p className="text-gray-400 text-sm">
              {weatherData.rainfall > 10 
                ? 'Focus on drainage maintenance. Monitor blade conditions.'
                : 'Optimal for stripping and leveling operations.'}
            </p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">💧</div>
              <div className="font-bold text-white">Water Management</div>
            </div>
            <p className="text-gray-400 text-sm">
              {weatherData.rainfall > 10 
                ? 'Activate all pumps. Monitor pit water levels hourly.'
                : 'Normal water spraying for dust control.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningDashboard;