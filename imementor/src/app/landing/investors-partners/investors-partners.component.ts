import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface InvestorPartner {
  type: 'investor' | 'partner';
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  contactAction: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'organization' | 'community' | 'company';
  website?: string;
  description: string;
  partnership: string;
}

export interface PartnershipOpportunity {
  type: 'organization' | 'community' | 'company';
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  examples: string[];
}

@Component({
  selector: 'app-investors-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investors-partners.component.html',
  styleUrl: './investors-partners.component.scss'
})
export class InvestorsPartnersComponent {
  constructor(private router: Router) {}

  // Current Partners
  currentPartners: Partner[] = [
    // Organizations
    {
      id: 'deped',
      name: 'Department of Education',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
      type: 'organization',
      website: 'https://deped.gov.ph',
      description: 'Official partner for educational curriculum integration',
      partnership: 'Curriculum Development'
    },
    {
      id: 'tesda',
      name: 'TESDA Philippines',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center',
      type: 'organization',
      website: 'https://tesda.gov.ph',
      description: 'Technical skills training and certification programs',
      partnership: 'Skills Certification'
    },
    {
      id: 'ched',
      name: 'Commission on Higher Education',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop&crop=center',
      type: 'organization',
      website: 'https://ched.gov.ph',
      description: 'Higher education policy and quality assurance',
      partnership: 'Higher Education Integration'
    },
    
    // Communities
    {
      id: 'devcon',
      name: 'DevCon Philippines',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop&crop=center',
      type: 'community',
      website: 'https://devcon.ph',
      description: 'Leading developer community in the Philippines',
      partnership: 'Tech Mentorship'
    },
    {
      id: 'fintechph',
      name: 'Fintech Philippines Association',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop&crop=center',
      type: 'community',
      website: 'https://fintechphilippines.org',
      description: 'Fintech industry professionals and startups',
      partnership: 'Financial Technology Mentorship'
    },
    {
      id: 'psite',
      name: 'Philippine Society of IT Educators',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center',
      type: 'community',
      description: 'Network of IT educators and professionals',
      partnership: 'Academic-Industry Bridge'
    },
    
    // Companies
    {
      id: 'accenture',
      name: 'Accenture Philippines',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop&crop=center',
      type: 'company',
      website: 'https://accenture.com',
      description: 'Global technology consulting and services',
      partnership: 'Corporate Mentorship Program'
    },
    {
      id: 'globe',
      name: 'Globe Telecom',
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop&crop=center',
      type: 'company',
      website: 'https://globe.com.ph',
      description: 'Leading telecommunications company',
      partnership: 'Digital Innovation Mentorship'
    },
    {
      id: 'unionbank',
      name: 'UnionBank of the Philippines',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop&crop=center',
      type: 'company',
      website: 'https://unionbankph.com',
      description: 'Digital banking and financial services',
      partnership: 'Financial Services Mentorship'
    },
    {
      id: 'gcash',
      name: 'GCash',
      logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop&crop=center',
      type: 'company',
      website: 'https://gcash.com',
      description: 'Leading mobile wallet and financial services',
      partnership: 'Fintech Career Development'
    }
  ];

  // Partnership Opportunities
  partnershipOpportunities: PartnershipOpportunity[] = [
    {
      type: 'organization',
      title: 'Educational Organizations',
      description: 'Partner with us to enhance educational outcomes and bridge the skills gap between academia and industry.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>`,
      benefits: [
        'Enhanced curriculum with industry-relevant skills',
        'Direct access to industry mentors for students',
        'Career guidance and placement support',
        'Professional development for educators'
      ],
      examples: ['Universities', 'Government Agencies', 'NGOs', 'Training Centers']
    },
    {
      type: 'community',
      title: 'Professional Communities',
      description: 'Join our network to connect your community members with students seeking mentorship and guidance.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`,
      benefits: [
        'Expand your community\'s impact and reach',
        'Provide value to members through mentoring opportunities',
        'Access to emerging talent and fresh perspectives',
        'Co-hosted events and knowledge sharing sessions'
      ],
      examples: ['Developer Communities', 'Industry Associations', 'Alumni Networks', 'Professional Groups']
    },
    {
      type: 'company',
      title: 'Corporate Partners',
      description: 'Build your talent pipeline and give back to the community through structured mentorship programs.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="7.5,4.21 12,6.81 16.5,4.21"></polyline>
        <polyline points="7.5,19.79 7.5,14.6 3,12"></polyline>
        <polyline points="21,12 16.5,14.6 16.5,19.79"></polyline>
      </svg>`,
      benefits: [
        'Early access to top talent for recruitment',
        'Enhanced employer branding and CSR initiatives',
        'Employee engagement through mentoring roles',
        'Insights into emerging skills and market trends'
      ],
      examples: ['Tech Companies', 'Financial Services', 'Consulting Firms', 'Startups']
    }
  ];

  opportunities: InvestorPartner[] = [
    {
      type: 'investor',
      title: 'Investment Opportunities',
      description: 'Join us in revolutionizing mentorship in the Philippines. IMementor is positioned to transform how students connect with industry professionals.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>`,
      benefits: [
        'Growing market in EdTech and mentorship',
        'Strong user acquisition and retention metrics',
        'Scalable platform across SEA region',
        'Government support for digital education',
        'Experienced founding team'
      ],
      contactAction: 'Schedule Investment Meeting'
    },
    {
      type: 'partner',
      title: 'Strategic Partnerships',
      description: 'Partner with IMementor to expand your reach in the education and professional development space. We\'re looking for strategic partners who share our vision.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`,
      benefits: [
        'Access to our growing student network',
        'Brand exposure to young professionals',
        'Corporate mentorship programs',
        'Talent pipeline for recruitment',
        'Co-marketing opportunities'
      ],
      contactAction: 'Explore Partnership'
    }
  ];

  stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Industry Mentors' },
    { number: '50+', label: 'Partner Organizations' },
    { number: '25+', label: 'Corporate Partners' }
  ];

  getPartnersByType(type: 'organization' | 'community' | 'company'): Partner[] {
    return this.currentPartners.filter(partner => partner.type === type);
  }

  getPartnershipOpportunity(type: 'organization' | 'community' | 'company'): PartnershipOpportunity | undefined {
    return this.partnershipOpportunities.find(opp => opp.type === type);
  }

  onPartnerWebsite(partner: Partner) {
    if (partner.website) {
      window.open(partner.website, '_blank');
    }
  }

  onBecomePartner(type: 'organization' | 'community' | 'company') {
    this.router.navigate(['/'], { 
      fragment: 'contact', 
      queryParams: { type: 'partnership', category: type } 
    });
  }

  onContactInvestors() {
    // Navigate to contact page with investor query
    this.router.navigate(['/'], { fragment: 'contact', queryParams: { type: 'investor' } });
  }

  onContactPartners() {
    // Navigate to contact page with partner query  
    this.router.navigate(['/'], { fragment: 'contact', queryParams: { type: 'partner' } });
  }

  onScheduleMeeting() {
    // Open external calendar booking or contact form
    console.log('Opening investor meeting scheduler...');
    // You can integrate with Calendly, Google Calendar, or other booking systems
  }
}
