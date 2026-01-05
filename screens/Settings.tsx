
import React from 'react';
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  HelpCircle, 
  Globe, 
  ChevronRight,
  CreditCard
} from 'lucide-react';

const Settings: React.FC<{ user: any }> = ({ user }) => {
  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Profile Information', icon: UserIcon, detail: user.name },
        { label: 'Payment Methods', icon: CreditCard, detail: 'Cash Only' },
      ]
    },
    {
      title: 'App Settings',
      items: [
        { label: 'Notifications', icon: Bell, detail: 'Enabled' },
        { label: 'Language', icon: Globe, detail: 'English' },
        { label: 'Security & Privacy', icon: Shield },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="p-4 space-y-8">
      <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
          {user.name[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-blue-100 text-sm">{user.phone}</p>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2 mb-3">
            {section.title}
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
            {section.items.map((item) => (
              <button 
                key={item.label}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.detail && (
                    <span className="text-xs text-gray-400 font-medium">{item.detail}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center pt-4">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">
          Adile Drive v1.0.4 • Made with ❤️ in Morocco
        </p>
      </div>
    </div>
  );
};

export default Settings;
