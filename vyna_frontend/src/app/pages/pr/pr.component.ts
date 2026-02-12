import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export type PrTab = 'news' | 'events' | 'videos';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  externalUrl: string;
  tag: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  externalUrl: string;
  tag: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
}

@Component({
  selector: 'app-pr',
  templateUrl: './pr.component.html',
  styleUrls: ['./pr.component.css'],
})
export class PrComponent implements OnInit {
  activeTab: PrTab = 'news';

  tabs: { id: PrTab; label: string; icon: string }[] = [
    { id: 'news', label: 'News', icon: 'newspaper' },
    { id: 'events', label: 'Events', icon: 'event' },
    { id: 'videos', label: 'Videos', icon: 'play_circle' },
  ];

  newsItems: NewsItem[] = [];
  eventItems: EventItem[] = [];
  videoItems: VideoItem[] = [];

  featuredVideoId: string = '';
  featuredVideoUrl: SafeResourceUrl | null = null;
  featuredVideoTitle: string = '';
  featuredVideoDescription: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadNews();
    this.loadEvents();
    this.loadVideos();
  }

  switchTab(tab: PrTab): void {
    this.activeTab = tab;
  }

  /* ────────────────────────────────
     NEWS
     ──────────────────────────────── */
  private loadNews(): void {
    this.newsItems = [
      {
        id: 'n1',
        title: 'India\'s LED Lighting Market Set to Reach $15 Billion by 2027',
        summary: 'The rapid adoption of energy-efficient lighting solutions across residential and commercial sectors is driving unprecedented growth in India\'s LED market.',
        source: 'Economic Times',
        date: 'Jan 28, 2026',
        imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=400&fit=crop',
        externalUrl: 'https://economictimes.indiatimes.com',
        tag: 'Industry',
      },
      {
        id: 'n2',
        title: 'Smart Switchgear: The Future of Home Automation in India',
        summary: 'IoT-enabled switchgear systems are transforming how Indian households manage electricity, offering remote control and energy monitoring capabilities.',
        source: 'Livemint',
        date: 'Jan 15, 2026',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
        externalUrl: 'https://www.livemint.com',
        tag: 'Technology',
      },
      {
        id: 'n3',
        title: 'BIS Introduces New Safety Standards for Electrical Wiring',
        summary: 'The Bureau of Indian Standards has released updated safety guidelines for residential and commercial electrical wiring installations effective 2026.',
        source: 'The Hindu',
        date: 'Jan 5, 2026',
        imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492CC74b4?w=600&h=400&fit=crop',
        externalUrl: 'https://www.thehindu.com',
        tag: 'Regulation',
      },
      {
        id: 'n4',
        title: 'Solar-Integrated Electrical Solutions Gain Traction in Tier 2 Cities',
        summary: 'Rising electricity costs and government subsidies are driving rapid adoption of solar-integrated electrical systems in India\'s emerging urban centres.',
        source: 'Business Standard',
        date: 'Dec 20, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
        externalUrl: 'https://www.business-standard.com',
        tag: 'Sustainability',
      },
      {
        id: 'n5',
        title: 'BLDC Ceiling Fans: How Energy Star Ratings Are Changing Consumer Choices',
        summary: 'Consumers are increasingly opting for BLDC motor fans that consume up to 65% less electricity, driven by new energy labelling mandates.',
        source: 'India Today',
        date: 'Dec 10, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
        externalUrl: 'https://www.indiatoday.in',
        tag: 'Products',
      },
      {
        id: 'n6',
        title: 'Government Pushes for 100% LED Street Lighting by 2028',
        summary: 'A new national initiative aims to replace all conventional street lights with energy-efficient LEDs, targeting a 40% reduction in municipal electricity consumption.',
        source: 'NDTV',
        date: 'Nov 30, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
        externalUrl: 'https://www.ndtv.com',
        tag: 'Policy',
      },
    ];
  }

  /* ────────────────────────────────
     EVENTS
     ──────────────────────────────── */
  private loadEvents(): void {
    this.eventItems = [
      {
        id: 'e1',
        title: 'Elecrama 2026 — World\'s Largest Electrical Expo',
        date: 'Feb 15–19, 2026',
        location: 'India Expo Centre, Greater Noida',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tag: 'Expo',
      },
      {
        id: 'e2',
        title: 'Smart Home India Summit 2026',
        date: 'Mar 8–9, 2026',
        location: 'Pragati Maidan, New Delhi',
        imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=500&h=500&fit=crop',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tag: 'Conference',
      },
      {
        id: 'e3',
        title: 'LED Expo India 2026',
        date: 'Apr 22–24, 2026',
        location: 'Bombay Exhibition Centre, Mumbai',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&h=500&fit=crop',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tag: 'Exhibition',
      },
      {
        id: 'e4',
        title: 'National Electrical Safety Week',
        date: 'May 12–18, 2026',
        location: 'Pan India — Virtual + Offline',
        imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&h=500&fit=crop',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tag: 'Awareness',
      },
      {
        id: 'e5',
        title: 'Renewable Energy India Expo 2026',
        date: 'Jun 5–7, 2026',
        location: 'India Expo Mart, Greater Noida',
        imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=500&h=500&fit=crop',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tag: 'Green Energy',
      },
      {
        id: 'e6',
        title: 'IEEMA Annual Convention 2026',
        date: 'Jul 20–21, 2026',
        location: 'Taj Palace, New Delhi',
        imageUrl: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=500&h=500&fit=crop',
        externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tag: 'Convention',
      },
    ];
  }

  /* ────────────────────────────────
     VIDEOS
     ──────────────────────────────── */
  private loadVideos(): void {
    this.videoItems = [
      {
        id: 'v1',
        title: 'How MCB Circuit Breakers Work — Explained',
        description: 'A detailed visual breakdown of miniature circuit breakers, their internal mechanism, and how they protect your home.',
        youtubeId: 'oIFJxsh8eqw',
        thumbnailUrl: 'https://img.youtube.com/vi/oIFJxsh8eqw/hqdefault.jpg',
        duration: '8:24',
        date: 'Jan 2026',
      },
      {
        id: 'v2',
        title: 'LED vs CFL vs Incandescent — Real Power Test',
        description: 'Side-by-side comparison of energy consumption and light output across three lighting technologies.',
        youtubeId: 'aw5HcOL9bug',
        thumbnailUrl: 'https://img.youtube.com/vi/aw5HcOL9bug/hqdefault.jpg',
        duration: '12:15',
        date: 'Dec 2025',
      },
      {
        id: 'v3',
        title: 'Complete House Wiring Tutorial for Beginners',
        description: 'Step-by-step guide to residential electrical wiring covering circuits, earthing, and safety standards.',
        youtubeId: 'lU8GFGSmIHk',
        thumbnailUrl: 'https://img.youtube.com/vi/lU8GFGSmIHk/hqdefault.jpg',
        duration: '22:40',
        date: 'Nov 2025',
      },
      {
        id: 'v4',
        title: 'BLDC Fan Technology — Why It Saves 65% Electricity',
        description: 'Engineering deep-dive into brushless DC motor fans and why they outperform conventional induction motor fans.',
        youtubeId: 'TBVb2CtYaRY',
        thumbnailUrl: 'https://img.youtube.com/vi/TBVb2CtYaRY/hqdefault.jpg',
        duration: '10:30',
        date: 'Oct 2025',
      },
      {
        id: 'v5',
        title: 'Understanding Electrical Panels — Distribution Board Basics',
        description: 'How distribution boards are wired, what each component does, and tips for safe panel management.',
        youtubeId: 'AvNiFcicdfQ',
        thumbnailUrl: 'https://img.youtube.com/vi/AvNiFcicdfQ/hqdefault.jpg',
        duration: '15:10',
        date: 'Sep 2025',
      },
      {
        id: 'v6',
        title: 'Smart Switches Installation Guide — Home Automation',
        description: 'How to install and configure IoT-enabled smart switches for home automation in Indian households.',
        youtubeId: 'e9sNSMxmT0U',
        thumbnailUrl: 'https://img.youtube.com/vi/e9sNSMxmT0U/hqdefault.jpg',
        duration: '14:05',
        date: 'Aug 2025',
      },
    ];

    // Set the first video as the featured video
    if (this.videoItems.length > 0) {
      this.setFeaturedVideo(this.videoItems[0]);
    }
  }

  setFeaturedVideo(video: VideoItem): void {
    this.featuredVideoId = video.id;
    this.featuredVideoTitle = video.title;
    this.featuredVideoDescription = video.description;
    this.featuredVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`
    );
  }

  getSafeYoutubeThumbnail(youtubeId: string): string {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  getActiveTabCount(): number {
    switch (this.activeTab) {
      case 'news':
        return this.newsItems.length;
      case 'events':
        return this.eventItems.length;
      case 'videos':
        return this.videoItems.length;
      default:
        return 0;
    }
  }
}
