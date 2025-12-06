import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GalleryItem {
  id: number;
  title: string;
  titleFa: string;
  image: string;
  category: string;
}

interface SearchItem {
  id: number;
  type: 'motivation' | 'prayer' | 'wisdom' | 'success' | 'life' | 'spiritual' | 'positive' | 'growth' | 'mindfulness' | 'inspiration';
  text: string;
  textFa: string;
  author?: string;
  authorFa?: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  // Language support
  currentLanguage: 'en' | 'fa' = 'en';
  showLanguageMenu = false;
  
  // Theme support
  currentTheme: 'light' | 'dark' = 'light';

  // Gallery items with 10 categories
  galleryItems: GalleryItem[] = [
    { id: 1, title: 'Motivational Texts', titleFa: 'متن های انگیزشی', image: 'https://picsum.photos/400/300?random=1', category: 'motivation' },
    { id: 2, title: 'Prayers', titleFa: 'دعا ها', image: 'https://picsum.photos/400/300?random=2', category: 'prayer' },
    { id: 3, title: 'Wisdom Quotes', titleFa: 'گفته‌های حکیمانه', image: 'https://picsum.photos/400/300?random=3', category: 'wisdom' },
    { id: 4, title: 'Success Stories', titleFa: 'داستان‌های موفقیت', image: 'https://picsum.photos/400/300?random=4', category: 'success' },
    { id: 5, title: 'Life Lessons', titleFa: 'درس‌های زندگی', image: 'https://picsum.photos/400/300?random=5', category: 'life' },
    { id: 6, title: 'Spiritual Guidance', titleFa: 'راهنمایی‌های معنوی', image: 'https://picsum.photos/400/300?random=6', category: 'spiritual' },
    { id: 7, title: 'Positive Thinking', titleFa: 'تفکر مثبت', image: 'https://picsum.photos/400/300?random=7', category: 'positive' },
    { id: 8, title: 'Personal Growth', titleFa: 'رشد شخصی', image: 'https://picsum.photos/400/300?random=8', category: 'growth' },
    { id: 9, title: 'Mindfulness', titleFa: 'ذهن‌آگاهی', image: 'https://picsum.photos/400/300?random=9', category: 'mindfulness' },
    { id: 10, title: 'Inspirational Stories', titleFa: 'داستان‌های الهام‌بخش', image: 'https://picsum.photos/400/300?random=10', category: 'inspiration' }
  ];

  // Component state
  currentView: 'gallery' | 'search' = 'gallery';
  searchQuery: string = '';
  filteredItems: SearchItem[] = [];
  selectedCategory: string = 'all';

  // Navigate to search page
  navigateToSearch(category: string): void {
    this.currentView = 'search';
    this.selectedCategory = category;
    this.searchQuery = '';
    this.filterItems();
  }

  // Navigate back to gallery
  navigateToGallery(): void {
    this.currentView = 'gallery';
    this.searchQuery = '';
  }

  // Toggle language menu
  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  // Select language
  selectLanguage(language: 'en' | 'fa'): void {
    this.currentLanguage = language;
    this.showLanguageMenu = false;
  }

  // Close language menu when clicking outside
  closeLanguageMenu(): void {
    this.showLanguageMenu = false;
  }

  // Toggle theme
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
  }

  // Filter items based on search query
  filterItems(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredItems = [];
      return;
    }

    this.filteredItems = this.searchItems.filter(item => {
      const textToSearch = this.currentLanguage === 'en' ? item.text : item.textFa;
      const authorToSearch = this.currentLanguage === 'en' ? item.author : item.authorFa;
      
      const matchesText = textToSearch.toLowerCase().includes(query);
      const matchesAuthor = authorToSearch?.toLowerCase().includes(query);
      const matchesCategory = this.selectedCategory === 'all' || item.type === this.selectedCategory;
      
      return (matchesText || matchesAuthor) && matchesCategory;
    });
  }

  // Track by function for performance
  trackByItemId(index: number, item: GalleryItem | SearchItem): number {
    return item.id;
  }

  // Get type icon
  getTypeIcon(type: string): string {
    switch (type) {
      case 'motivation': return '💪';
      case 'prayer': return '🙏';
      case 'wisdom': return '🧠';
      case 'success': return '🏆';
      case 'life': return '🌱';
      case 'spiritual': return '✨';
      case 'positive': return '😊';
      case 'growth': return '📈';
      case 'mindfulness': return '🧘';
      case 'inspiration': return '🌟';
      default: return '📄';
    }
  }

  // Get type color class
  getTypeColor(type: string): string {
    switch (type) {
      case 'motivation': return 'type-motivation';
      case 'prayer': return 'type-prayer';
      case 'wisdom': return 'type-wisdom';
      case 'success': return 'type-success';
      case 'life': return 'type-life';
      case 'spiritual': return 'type-spiritual';
      case 'positive': return 'type-positive';
      case 'growth': return 'type-growth';
      case 'mindfulness': return 'type-mindfulness';
      case 'inspiration': return 'type-inspiration';
      default: return 'type-default';
    }
  }

  // Get text based on current language
  getText(item: SearchItem): string {
    return this.currentLanguage === 'en' ? item.text : item.textFa;
  }

  // Get author based on current language
  getAuthor(item: SearchItem): string | undefined {
    return this.currentLanguage === 'en' ? item.author : item.authorFa;
  }

  // Get title based on current language
  getTitle(item: GalleryItem): string {
    return this.currentLanguage === 'en' ? item.title : item.titleFa;
  }

  // Get placeholder text based on language
  getSearchPlaceholder(): string {
    return this.currentLanguage === 'en' 
      ? 'Search for motivation, prayers, wisdom...' 
      : 'جستجو برای انگیزه، دعا، حکمت...';
  }

  // Get language button text
  getLanguageButtonText(): string {
    return this.currentLanguage === 'en' ? '🇺🇸' : '🇮🇷';
  }

  // Get theme button text
  getThemeButtonText(): string {
    return this.currentTheme === 'light' ? '🌙' : '☀️';
  }

  // Get theme button title
  getThemeButtonTitle(): string {
    return this.currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  }

  // Get language menu items
  getLanguageMenuItems(): { code: 'en' | 'fa'; name: string; flag: string }[] {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fa', name: 'فارسی', flag: '🇮🇷' }
    ];
  }

  // Search items with 20 items per category (200 total items)
  searchItems: SearchItem[] = [
    // Motivational Texts (20 items)
    { id: 1, type: 'motivation', text: 'Believe in yourself and all that you are.', textFa: 'به خودت و تمام آنچه هستی باور داشته باش.' },
    { id: 2, type: 'motivation', text: 'Your only limit is your mind.', textFa: 'تنها محدودیت تو ذهن توست.' },
    { id: 3, type: 'motivation', text: 'Dream big and dare to fail.', textFa: 'بزرگ فکر کن و جسارت شکست خوردن را داشته باش.' },
    { id: 4, type: 'motivation', text: 'Success is not final, failure is not fatal.', textFa: 'موفقیت نهایی نیست، شکست کشنده نیست.' },
    { id: 5, type: 'motivation', text: 'The harder you work, the luckier you get.', textFa: 'هر چه سخت‌تر کار کنی، خوش‌شانس‌تر می‌شوی.' },
    { id: 6, type: 'motivation', text: 'Don\'t wait for opportunity, create it.', textFa: 'منتظر فرصت نباش، آن را خلق کن.' },
    { id: 7, type: 'motivation', text: 'Your attitude determines your direction.', textFa: 'نگرش تو مسیر تو را تعیین می‌کند.' },
    { id: 8, type: 'motivation', text: 'Great things never come from comfort zones.', textFa: 'چیزهای بزرگ هرگز از منطقه امن نمی‌آیند.' },
    { id: 9, type: 'motivation', text: 'Be so good they can\'t ignore you.', textFa: 'آنقدر خوب باش که نتوانند تو را نادیده بگیرند.' },
    { id: 10, type: 'motivation', text: 'The future depends on what you do today.', textFa: 'آینده به کاری که امروز انجام می‌دهی بستگی دارد.' },
    { id: 11, type: 'motivation', text: 'Don\'t stop when you\'re tired, stop when you\'re done.', textFa: 'وقتی خسته شدی متوقف نشو، وقتی تمام شد متوقف شو.' },
    { id: 12, type: 'motivation', text: 'Your potential is endless.', textFa: 'پتانسیل تو بی‌پایان است.' },
    { id: 13, type: 'motivation', text: 'Make today so awesome yesterday gets jealous.', textFa: 'امروز را آنقدر فوق‌العاده کن که دیروز حسادت کند.' },
    { id: 14, type: 'motivation', text: 'Small steps every day lead to big results.', textFa: 'قدم‌های کوچک هر روز به نتایج بزرگ می‌رسد.' },
    { id: 15, type: 'motivation', text: 'You are capable of amazing things.', textFa: 'تو قادر به انجام کارهای شگفت‌انگیزی هستی.' },
    { id: 16, type: 'motivation', text: 'Turn your wounds into wisdom.', textFa: 'زخم‌هایت را به حکمت تبدیل کن.' },
    { id: 17, type: 'motivation', text: 'Progress, not perfection.', textFa: 'پیشرفت، نه کمال.' },
    { id: 18, type: 'motivation', text: 'Your vibe attracts your tribe.', textFa: 'انرژی تو قبیله‌ات را جذب می‌کند.' },
    { id: 19, type: 'motivation', text: 'Stay positive, work hard, make it happen.', textFa: 'مثبت بمان، سخت کار کن، آن را محقق کن.' },
    { id: 20, type: 'motivation', text: 'The best view comes after the hardest climb.', textFa: 'بهترین منظره پس از سخت‌ترین صعود می‌آید.' },

    // Prayers (20 items)
    { id: 21, type: 'prayer', text: 'May your heart be filled with peace and love.', textFa: 'باشد که قلبت از صلح و عشق پر شود.' },
    { id: 22, type: 'prayer', text: 'Guide me to make the right decisions.', textFa: 'مرا هدایت کن تا تصمیمات درست بگیرم.' },
    { id: 23, type: 'prayer', text: 'Grant me strength to overcome challenges.', textFa: 'به من قدرت بده تا بر چالش‌ها غلبه کنم.' },
    { id: 24, type: 'prayer', text: 'Fill my soul with divine light.', textFa: 'روحم را از نور الهی پر کن.' },
    { id: 25, type: 'prayer', text: 'Protect my loved ones from harm.', textFa: 'عزیزانم را از آسیب محافظت کن.' },
    { id: 26, type: 'prayer', text: 'Help me find inner peace.', textFa: 'به من کمک کن تا آرامش درونی پیدا کنم.' },
    { id: 27, type: 'prayer', text: 'Bless my journey with wisdom.', textFa: 'سفر مرا با حکمت برکت بده.' },
    { id: 28, type: 'prayer', text: 'May your grace shine upon us.', textFa: 'باشد که لطف تو بر ما بتابد.' },
    { id: 29, type: 'prayer', text: 'Guide my steps in the right path.', textFa: 'قدم‌هایم را در مسیر درست هدایت کن.' },
    { id: 30, type: 'prayer', text: 'Fill my days with purpose and meaning.', textFa: 'روزهایم را از هدف و معنا پر کن.' },
    { id: 31, type: 'prayer', text: 'Help me forgive and let go.', textFa: 'به من کمک کن تا ببخشم و رها کنم.' },
    { id: 32, type: 'prayer', text: 'Grant me patience in difficult times.', textFa: 'در زمان‌های سخت به من صبر عطا کن.' },
    { id: 33, type: 'prayer', text: 'May your love surround me always.', textFa: 'باشد که عشق تو همیشه مرا احاطه کند.' },
    { id: 34, type: 'prayer', text: 'Help me see the good in everyone.', textFa: 'به من کمک کن تا خوبی را در همه ببینم.' },
    { id: 35, type: 'prayer', text: 'Bless my work with success.', textFa: 'کار مرا با موفقیت برکت بده.' },
    { id: 36, type: 'prayer', text: 'Guide me to be kind and compassionate.', textFa: 'مرا هدایت کن تا مهربان و دلسوز باشم.' },
    { id: 37, type: 'prayer', text: 'Protect me from negative energies.', textFa: 'مرا از انرژی‌های منفی محافظت کن.' },
    { id: 38, type: 'prayer', text: 'Help me grow spiritually every day.', textFa: 'به من کمک کن تا هر روز از نظر معنوی رشد کنم.' },
    { id: 39, type: 'prayer', text: 'May your peace fill my heart.', textFa: 'باشد که صلح تو قلب مرا پر کند.' },
    { id: 40, type: 'prayer', text: 'Guide me to live with gratitude.', textFa: 'مرا هدایت کن تا با سپاسگزاری زندگی کنم.' },

    // Wisdom Quotes (20 items)
    { id: 41, type: 'wisdom', text: 'The wise man learns from the mistakes of others.', textFa: 'انسان خردمند از اشتباهات دیگران یاد می‌گیرد.' },
    { id: 42, type: 'wisdom', text: 'Knowledge speaks, but wisdom listens.', textFa: 'دانش سخن می‌گوید، اما حکمت گوش می‌دهد.' },
    { id: 43, type: 'wisdom', text: 'The only true wisdom is in knowing you know nothing.', textFa: 'تنها حکمت واقعی در این است که بدانی چیزی نمی‌دانی.' },
    { id: 44, type: 'wisdom', text: 'Wisdom is the reward you get for a lifetime of listening.', textFa: 'حکمت پاداشی است که برای یک عمر گوش دادن دریافت می‌کنی.' },
    { id: 45, type: 'wisdom', text: 'The journey of a thousand miles begins with one step.', textFa: 'سفر هزار مایلی با یک قدم آغاز می‌شود.' },
    { id: 46, type: 'wisdom', text: 'Patience is the companion of wisdom.', textFa: 'صبر همراه حکمت است.' },
    { id: 47, type: 'wisdom', text: 'The wise adapt themselves to circumstances.', textFa: 'خردمند خود را با شرایط وفق می‌دهد.' },
    { id: 48, type: 'wisdom', text: 'Silence is a source of great strength.', textFa: 'سکوت منبع قدرت بزرگی است.' },
    { id: 49, type: 'wisdom', text: 'A wise man makes his own decisions.', textFa: 'انسان خردمند تصمیمات خود را می‌گیرد.' },
    { id: 50, type: 'wisdom', text: 'The greatest wisdom is in simplicity.', textFa: 'بزرگترین حکمت در سادگی است.' },
    { id: 51, type: 'wisdom', text: 'Wisdom comes from experience.', textFa: 'حکمت از تجربه می‌آید.' },
    { id: 52, type: 'wisdom', text: 'A wise person knows what to overlook.', textFa: 'انسان خردمند می‌داند چه چیزی را نادیده بگیرد.' },
    { id: 53, type: 'wisdom', text: 'The wise see things as they are, not as they wish.', textFa: 'خردمند چیزها را همانطور که هستند می‌بیند، نه آنطور که آرزو دارد.' },
    { id: 54, type: 'wisdom', text: 'Wisdom is not a product of schooling but of lifelong learning.', textFa: 'حکمت محصول مدرسه نیست، بلکه محصول یادگیری مادام‌العمر است.' },
    { id: 55, type: 'wisdom', text: 'The wise man knows he knows nothing, the fool thinks he knows all.', textFa: 'انسان خردمند می‌داند که چیزی نمی‌داند، احمق فکر می‌کند همه چیز را می‌داند.' },
    { id: 56, type: 'wisdom', text: 'True wisdom comes from within.', textFa: 'حکمت واقعی از درون می‌آید.' },
    { id: 57, type: 'wisdom', text: 'Wisdom is the right use of knowledge.', textFa: 'حکمت استفاده درست از دانش است.' },
    { id: 58, type: 'wisdom', text: 'The wise find pleasure in water, the virtuous find pleasure in hills.', textFa: 'خردمند در آب لذت می‌برد، نیکوکار در تپه‌ها لذت می‌برد.' },
    { id: 59, type: 'wisdom', text: 'Wisdom begins in wonder.', textFa: 'حکمت با شگفتی آغاز می‌شود.' },
    { id: 60, type: 'wisdom', text: 'A wise man will make more opportunities than he finds.', textFa: 'انسان خردمند فرصت‌های بیشتری از آنچه پیدا می‌کند خلق می‌کند.' }
  ];
}
