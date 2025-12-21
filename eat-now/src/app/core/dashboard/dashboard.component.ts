// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  trend: number;
  trendLabel: string;
  color: string;
  bgColor: string;
}

interface RecentActivity {
  id: number;
  type: 'payment' | 'tenant' | 'maintenance' | 'room';
  title: string;
  description: string;
  time: string;
  icon: string;
  iconColor: string;
}

interface UpcomingPayment {
  tenantName: string;
  roomNumber: string;
  amount: number;
  dueDate: Date;
  status: 'due' | 'overdue' | 'paid';
}

interface MaintenanceRequest {
  id: number;
  title: string;
  roomNumber: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  reportedDate: Date;
}

interface OccupancyData {
  floor: string;
  occupied: number;
  vacant: number;
  maintenance: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Current date
  currentDate = new Date();
  greeting: string = '';

  // Stats Cards
  statCards: StatCard[] = [
    {
      title: 'Total Rooms',
      value: 48,
      icon: 'bi-door-open',
      trend: 4,
      trendLabel: 'new this month',
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)'
    },
    {
      title: 'Active Tenants',
      value: 156,
      icon: 'bi-people',
      trend: 12,
      trendLabel: 'vs last month',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Monthly Revenue',
      value: '₹4,85,000',
      icon: 'bi-currency-rupee',
      trend: 8.5,
      trendLabel: 'vs last month',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Pending Issues',
      value: 12,
      icon: 'bi-exclamation-triangle',
      trend: -3,
      trendLabel: 'vs last week',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ];

  // Occupancy Overview
  occupancyData: OccupancyData[] = [
    { floor: 'Floor 1', occupied: 12, vacant: 2, maintenance: 1, total: 15 },
    { floor: 'Floor 2', occupied: 14, vacant: 1, maintenance: 0, total: 15 },
    { floor: 'Floor 3', occupied: 10, vacant: 4, maintenance: 1, total: 15 },
    { floor: 'Floor 4', occupied: 8, vacant: 5, maintenance: 2, total: 15 }
  ];

  // ========================================
  // REVENUE LINE CHART
  // ========================================
  revenueChartType = 'line' as const;
  
  revenueChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [380000, 420000, 395000, 450000, 485000, 520000, 495000, 530000, 485000, 510000, 545000, 485000],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Expenses',
        data: [120000, 135000, 125000, 140000, 155000, 145000, 160000, 150000, 145000, 155000, 165000, 150000],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `₹${context.raw?.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#6b7280' }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
          callback: (value) => `₹${(Number(value) / 1000)}k`
        }
      }
    }
  };

  // ========================================
  // OCCUPANCY DOUGHNUT CHART
  // ========================================
  occupancyChartType = 'doughnut' as const;
  
  occupancyChartData: ChartData<'doughnut'> = {
    labels: ['Occupied', 'Vacant', 'Maintenance'],
    datasets: [{
      data: [44, 12, 4],
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  occupancyChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 12 }
        }
      }
    }
  };

  // ========================================
  // PAYMENT BAR CHART
  // ========================================
  paymentChartType = 'bar' as const;
  
  paymentChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Collected',
        data: [420000, 450000, 430000, 480000, 495000, 485000],
        backgroundColor: '#10b981',
        borderRadius: 6
      },
      {
        label: 'Pending',
        data: [35000, 28000, 42000, 25000, 18000, 32000],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      },
      {
        label: 'Overdue',
        data: [12000, 8000, 15000, 10000, 5000, 8000],
        backgroundColor: '#ef4444',
        borderRadius: 6
      }
    ]
  };

  paymentChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 11 }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#6b7280' }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
          callback: (value) => `₹${(Number(value) / 1000)}k`
        }
      }
    }
  };

  // ========================================
  // MAINTENANCE POLAR AREA CHART
  // ========================================
  maintenanceChartType = 'polarArea' as const;
  
  maintenanceChartData: ChartData<'polarArea'> = {
    labels: ['Plumbing', 'Electrical', 'AC/HVAC', 'Furniture', 'Cleaning', 'Others'],
    datasets: [{
      data: [8, 5, 12, 3, 6, 4],
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(107, 114, 128, 0.7)'
      ]
    }]
  };

  maintenanceChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 12,
          font: { size: 11 }
        }
      }
    }
  };

  // ========================================
  // LISTS DATA
  // ========================================
  
  // Recent Activities
  recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      description: 'John Doe paid ₹8,000 for Room 101',
      time: '2 hours ago',
      icon: 'bi-currency-rupee',
      iconColor: '#10b981'
    },
    {
      id: 2,
      type: 'tenant',
      title: 'New Tenant Onboarded',
      description: 'Sarah Smith moved to Room 205',
      time: '4 hours ago',
      icon: 'bi-person-plus',
      iconColor: '#6366f1'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance Completed',
      description: 'AC repair in Room 302 resolved',
      time: '6 hours ago',
      icon: 'bi-tools',
      iconColor: '#f59e0b'
    },
    {
      id: 4,
      type: 'room',
      title: 'Room Status Updated',
      description: 'Room 108 marked as Available',
      time: '8 hours ago',
      icon: 'bi-door-open',
      iconColor: '#8b5cf6'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Overdue',
      description: 'Mike Johnson - Room 404 overdue by 5 days',
      time: '1 day ago',
      icon: 'bi-exclamation-circle',
      iconColor: '#ef4444'
    }
  ];

  // Upcoming Payments
  upcomingPayments: UpcomingPayment[] = [
    { tenantName: 'John Doe', roomNumber: '101', amount: 8000, dueDate: new Date('2024-01-05'), status: 'due' },
    { tenantName: 'Sarah Smith', roomNumber: '205', amount: 12000, dueDate: new Date('2024-01-03'), status: 'overdue' },
    { tenantName: 'Mike Johnson', roomNumber: '302', amount: 9500, dueDate: new Date('2024-01-07'), status: 'due' },
    { tenantName: 'Emily Brown', roomNumber: '108', amount: 7500, dueDate: new Date('2024-01-10'), status: 'due' },
    { tenantName: 'David Wilson', roomNumber: '404', amount: 11000, dueDate: new Date('2024-01-02'), status: 'overdue' }
  ];

  // Maintenance Requests
  maintenanceRequests: MaintenanceRequest[] = [
    { id: 1, title: 'AC not cooling', roomNumber: '302', priority: 'high', status: 'in-progress', reportedDate: new Date('2024-01-02') },
    { id: 2, title: 'Leaking tap', roomNumber: '105', priority: 'medium', status: 'pending', reportedDate: new Date('2024-01-03') },
    { id: 3, title: 'Light not working', roomNumber: '208', priority: 'low', status: 'pending', reportedDate: new Date('2024-01-04') },
    { id: 4, title: 'Door lock issue', roomNumber: '401', priority: 'high', status: 'pending', reportedDate: new Date('2024-01-04') }
  ];

  // Quick Actions
  quickActions = [
    { label: 'Add Tenant', icon: 'bi-person-plus', route: '/core/tenant-management', color: '#6366f1' },
    { label: 'Add Room', icon: 'bi-door-open', route: '/core/room-management', color: '#10b981' },
    { label: 'Record Payment', icon: 'bi-currency-rupee', route: '/core/payment-management', color: '#f59e0b' },
    { label: 'Report Issue', icon: 'bi-tools', route: '/core/maintenance-management', color: '#ef4444' },
    { label: 'Add Expense', icon: 'bi-receipt', route: '/core/expenses-management', color: '#8b5cf6' },
    { label: 'Announcements', icon: 'bi-megaphone', route: '/core/announcements', color: '#ec4899' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.setGreeting();
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  getOccupancyPercentage(data: OccupancyData): number {
    return Math.round((data.occupied / data.total) * 100);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'due': return 'status-due';
      case 'overdue': return 'status-overdue';
      case 'paid': return 'status-paid';
      default: return '';
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}