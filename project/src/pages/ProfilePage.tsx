import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Package, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders } from '../services/orderService';
import PrescriptionUpload from '../components/Profile/PrescriptionUpload';
import { Order, Prescription, Address } from '../types';
import { formatDateWithTime } from '../utils/format';
import { showToast } from '../components/UI/Toast';

const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);

  useEffect(() => {
    // Get active tab from URL if present
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
      if (tabParam === 'login') {
        setIsLoginForm(true);
      } else if (tabParam === 'register') {
        setIsLoginForm(false);
      }
    }
    
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [searchParams, isAuthenticated]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // Fetch orders
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders);
        
        // Fetch prescriptions (mock data for demo)
        setPrescriptions([
          {
            id: 'pres1',
            userId: user.id,
            image: 'https://images.pexels.com/photos/4226219/pexels-photo-4226219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            status: 'approved',
            createdAt: '2025-05-15T14:30:00Z',
            expiresAt: '2025-11-15T14:30:00Z',
          },
          {
            id: 'pres2',
            userId: user.id,
            image: 'https://images.pexels.com/photos/4344615/pexels-photo-4344615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            status: 'pending',
            createdAt: '2025-06-02T10:15:00Z',
          }
        ]);
        
        // Fetch addresses (mock data for demo)
        setAddresses([
          {
            fullName: 'John Doe',
            streetAddress: '123 Health St',
            city: 'Medical City',
            state: 'Wellness State',
            postalCode: '12345',
            country: 'United States',
            phone: '(555) 123-4567',
            isDefault: true,
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginForm) {
      const success = await login(email, password);
      if (success) {
        showToast('Login successful!', 'success');
        navigate('/profile');
      }
    } else {
      const success = await register(name, email, password);
      if (success) {
        showToast('Registration successful!', 'success');
        navigate('/profile');
      }
    }
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out', 'info');
    navigate('/');
  };

  const handleUploadComplete = (fileUrl: string) => {
    // In a real app, this would create a new prescription entry
    const newPrescription: Prescription = {
      id: `pres${Date.now()}`,
      userId: user?.id || '',
      image: fileUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setPrescriptions(prev => [newPrescription, ...prev]);
    changeTab('prescriptions');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {isAuthenticated ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  <button
                    onClick={() => changeTab('profile')}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    My Profile
                  </button>
                  <button
                    onClick={() => changeTab('orders')}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                      activeTab === 'orders'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Package size={18} className="mr-3" />
                    My Orders
                  </button>
                  <button
                    onClick={() => changeTab('prescriptions')}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                      activeTab === 'prescriptions'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FileText size={18} className="mr-3" />
                    Prescriptions
                  </button>
                  <button
                    onClick={() => changeTab('settings')}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                      activeTab === 'settings'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings size={18} className="mr-3" />
                    Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <h3 className="font-medium mb-3">Personal Information</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={user?.name}
                                readOnly
                                className="input bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                              <input
                                type="email"
                                value={user?.email}
                                readOnly
                                className="input bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <input
                                type="tel"
                                placeholder="Add phone number"
                                className="input"
                              />
                            </div>
                          </div>
                          <button className="btn btn-primary mt-4">
                            Update Profile
                          </button>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="font-medium mb-3">Shipping Addresses</h3>
                          {addresses.length > 0 ? (
                            <div className="space-y-4">
                              {addresses.map((address, index) => (
                                <div key={index} className="border rounded-md p-4">
                                  <div className="flex justify-between mb-2">
                                    <div className="font-medium">{address.fullName}</div>
                                    {address.isDefault && (
                                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    <p>{address.streetAddress}</p>
                                    <p>{address.city}, {address.state} {address.postalCode}</p>
                                    <p>{address.country}</p>
                                    <p className="mt-1">Phone: {address.phone}</p>
                                  </div>
                                  <div className="mt-3 flex space-x-3">
                                    <button className="text-sm text-primary-600 hover:text-primary-800">
                                      Edit
                                    </button>
                                    <button className="text-sm text-gray-600 hover:text-gray-800">
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">No addresses added yet.</p>
                          )}
                          <button className="btn btn-secondary mt-4">
                            Add New Address
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-6">My Orders</h2>
                      {orders.length > 0 ? (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-4 border-b">
                                <div className="flex flex-wrap justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">{order.id}</h3>
                                    <p className="text-sm text-gray-600">
                                      Placed on {formatDateWithTime(order.createdAt)}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      order.status === 'delivered' 
                                        ? 'bg-success-100 text-success-800' 
                                        : order.status === 'cancelled'
                                        ? 'bg-error-100 text-error-800'
                                        : 'bg-primary-100 text-primary-800'
                                    }`}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <button
                                      onClick={() => navigate(`/order-tracking/${order.id}`)}
                                      className="text-sm text-primary-600 hover:text-primary-800"
                                    >
                                      Track Order
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="space-y-4">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                      <div className="flex-grow">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-600">
                                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                      <div className="font-medium">
                                        ${(item.quantity * item.price).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between">
                                  <span className="font-medium">Total:</span>
                                  <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Package size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-800 mb-2">No orders yet</h3>
                          <p className="text-gray-600 mb-4">
                            You haven't placed any orders yet. Browse our products to get started.
                          </p>
                          <button
                            onClick={() => navigate('/medicines')}
                            className="btn btn-primary"
                          >
                            Shop Now
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Prescriptions Tab */}
                  {activeTab === 'prescriptions' && (
                    <div className="space-y-6">
                      <PrescriptionUpload onUploadComplete={handleUploadComplete} />
                      
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-6">My Prescriptions</h2>
                        {prescriptions.length > 0 ? (
                          <div className="space-y-6">
                            {prescriptions.map((prescription) => (
                              <div key={prescription.id} className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="aspect-square md:aspect-auto flex items-center justify-center overflow-hidden bg-gray-100">
                                    <img 
                                      src={prescription.image} 
                                      alt="Prescription" 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="col-span-2 p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-medium">Prescription {prescription.id}</h3>
                                        <p className="text-sm text-gray-600">
                                          Uploaded on {formatDateWithTime(prescription.createdAt)}
                                        </p>
                                        {prescription.expiresAt && (
                                          <p className="text-sm text-gray-600">
                                            Expires on {formatDateWithTime(prescription.expiresAt)}
                                          </p>
                                        )}
                                      </div>
                                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                        prescription.status === 'approved' 
                                          ? 'bg-success-100 text-success-800' 
                                          : prescription.status === 'rejected'
                                          ? 'bg-error-100 text-error-800'
                                          : 'bg-primary-100 text-primary-800'
                                      }`}>
                                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                                      </span>
                                    </div>
                                    
                                    {prescription.notes && (
                                      <div className="mt-3 bg-gray-50 p-3 rounded">
                                        <h4 className="text-sm font-medium mb-1">Pharmacist Notes:</h4>
                                        <p className="text-sm text-gray-600">{prescription.notes}</p>
                                      </div>
                                    )}
                                    
                                    <div className="mt-4 space-x-3">
                                      {prescription.status === 'approved' ? (
                                        <button 
                                          onClick={() => navigate('/medicines?prescription=required')}
                                          className="btn btn-primary text-sm"
                                        >
                                          Shop With This Prescription
                                        </button>
                                      ) : prescription.status === 'pending' ? (
                                        <button className="btn btn-secondary text-sm" disabled>
                                          Pending Review
                                        </button>
                                      ) : (
                                        <button className="btn btn-primary text-sm">
                                          Upload New Prescription
                                        </button>
                                      )}
                                      <button className="btn btn-secondary text-sm">View Details</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No prescriptions yet</h3>
                            <p className="text-gray-600 mb-4">
                              You haven't uploaded any prescriptions yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3">Change Password</h3>
                          <form className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                              <input
                                type="password"
                                className="input"
                                placeholder="Enter current password"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                              <input
                                type="password"
                                className="input"
                                placeholder="Enter new password"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                              <input
                                type="password"
                                className="input"
                                placeholder="Confirm new password"
                              />
                            </div>
                            <button className="btn btn-primary">
                              Update Password
                            </button>
                          </form>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="font-medium mb-3">Notification Preferences</h3>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 mr-2" defaultChecked />
                              <span>Order status updates</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 mr-2" defaultChecked />
                              <span>Prescription status updates</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 mr-2" defaultChecked />
                              <span>Promotional emails and discounts</span>
                            </label>
                          </div>
                          <button className="btn btn-secondary mt-4">
                            Save Preferences
                          </button>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="font-medium text-error-600 mb-3">Danger Zone</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button className="btn border border-error-600 text-error-600 hover:bg-error-50">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              {isLoginForm ? 'Sign In to Your Account' : 'Create an Account'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginForm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="Enter your password"
                />
              </div>
              
              <button type="submit" className="w-full btn btn-primary">
                {isLoginForm ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLoginForm ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLoginForm(!isLoginForm);
                    setSearchParams({ tab: isLoginForm ? 'register' : 'login' });
                  }}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  {isLoginForm ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;