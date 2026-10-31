// Arabic / English interface strings, English transliteration of names, and language switching.
// The language comes from ?lang=en|ar, then the last choice saved in this browser, then Arabic.
(function () {
  const STR = {
    ar: {
      brand: 'عائلة فرح',
      nav_home: 'الرئيسية',
      nav_tree: 'شجرة العائلة',
      lang_switch: 'English',
      tree_switch: 'نسخة الشجرة',
      login: 'دخول',
      logout: 'خروج',
      demo_banner: 'نسخة تجريبية — البيانات للعرض فقط',
      login_title: 'تسجيل الدخول',
      login_intro: 'تسجيل الدخول متاح لأفراد العائلة المخوّلين بتحديث الشجرة.',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      cancel: 'إلغاء',
      submit_login: 'دخول',
      bad_credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      logged_in: 'تم تسجيل الدخول',
      logged_out: 'تم تسجيل الخروج',
      demo_no_edit: 'وضع العرض التجريبي: التعديل غير مفعّل بعد',
      read_only: 'الموقع في وضع العرض التجريبي. أضف مفتاح Supabase في js/config.js لتفعيل التعديل.',
      load_failed: 'تعذر تحميل البيانات',

      title_home: 'عائلة فرح – الناصرة',
      hero_eyebrow: 'الناصرة · الجليل',
      hero_title: 'عائلة فرح',
      hero_alt: 'The Farah Family of Nazareth',
      hero_sub: 'جذورٌ ممتدة عبر <span data-stat="generations">١٣</span> جيلاً، من الجدّ سليمان إلى أبناء اليوم.',
      search_ph_home: 'ابحث عن اسم… مثال: زهير أديب',
      search_btn: 'بحث',
      about_title: 'نبذة تاريخية',
      about_history:
        '<p>يعود أصل عائلة فرح إلى جدها الأول فرح بن عبدالله القلزي بن سليمان بن نمر. ويقال ان عبدالله القلزي عمل كاتبا في ديوان عشيرة الغزاوية في قرية صخرة في جبل عجلون (الاردن اليوم), وقد هجرها لحادثة ما, على ما يبدو في النصف الأول من القرن السابع عشر.</p>' +
        '<p>وكان لعبد الله من الابناء أربعة: فرح (جدنا), خليف, نمر ومحارب. تتعدد الروايات حول أبناء أخرين له. أما نمر, فنسله اليوم هم عشيرة النمورة في بلدة الحصن (التابعة لمحافظة إربد), وتعتبر من أكبر وأقدم العشائر المسيحية هناك. وأما محارب فقد أسلم, ويعرف نسله بعشيرة العيل, ويقال أنهم إنضموا إلى الغزاوية.</p>' +
        '<p>أما عبدالله وإبنيه فرح وخليف, فهجروا صخرة إلى جوار جبل الطور (تابور), وبعد ذلك إستوطنوا قرية الشجرة ومن هناك قدموا أخيرًا إلى الناصرة. وأما نسل فرح فهم دار فرح في الناصرة, إحدى أقدم وأكبر العائلات المسيحية, وقد هاجر العديد من افراد العائلة خارج البلاد ونسلهم يتواجد اليوم في العديد من دول العالم, بالاخص مدينة فلينت في ولاية ميشيغان الامريكية.</p>' +
        '<p>وأما نسل خليف فهم حمولة الخليفية بالناصرة وتضم أكثر من عشرة عائلات. ويدعي نسل القلزي نسبًا غسانيًا, مع أن لا إثبات مباشر لذلك.</p>',
      about_byline: 'ميخائيل أمين فرح – الناصرة',
      about_caption: 'مكان مخصص لصورة العائلة',
      stats_title: 'العائلة بالأرقام',
      stat_persons: 'فرداً موثّقاً',
      stat_generations: 'جيلاً',
      stat_branches: 'فرعاً رئيسياً',
      stat_families: 'أسرة',
      origin_title: 'أصل العائلة وفروعها',
      origin_lead: 'التسلسل من الجدّ الأول حتى فرح، ثم الفروع الرئيسية التي تفرّعت من أحفاده. اضغط على أي فرع لفتحه في الشجرة.',
      arrow: '←',
      cta_title: 'استكشف شجرة العائلة',
      cta_text: 'تصفّح الأجيال، وابحث عن أي فرد، وتتبّع نسبه حتى الجدّ الأول.',
      cta_btn: 'افتح الشجرة التفاعلية',
      footer: '© عائلة فرح – الناصرة',
      footer_alt: 'The Farah Family · Nazareth',

      title_tree: 'شجرة عائلة فرح',
      search_ph_tree: 'ابحث بالاسم، أو الاسم واسم الأب: زهير أديب',
      search_hint: 'اكتب الاسم ثم اسم الأب والجد للتمييز',
      expand_all: 'توسيع الكل',
      expand_all_tip: 'عرض كل الأجيال',
      collapse: 'طيّ',
      collapse_tip: 'طيّ الشجرة',
      zoom_in: 'تكبير',
      zoom_out: 'تصغير',
      zoom_fit: 'ملاءمة الشاشة',
      loading: 'جارٍ تحميل الشجرة…',
      tree_failed: 'تعذر تحميل الشجرة: {msg}',
      no_results: 'لا توجد نتائج',
      generation: 'الجيل {n}',
      male: 'ذكر',
      female: 'أنثى',
      n_children: '{n} من الأبناء',
      n_descendants: '{n} من الذرية',
      mother: 'الأم',
      born: 'الميلاد',
      birthplace: 'مكان الميلاد',
      died: 'الوفاة',
      notes: 'ملاحظات',
      father: 'الأب',
      children_h: 'الأبناء ({n})',
      siblings_h: 'الإخوة ({n})',
      ancestry_h: 'النسب حتى الجدّ الأول',
      add_child: '+ إضافة ابن / ابنة',
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
      login_to_edit: 'سجّل الدخول لإضافة أفراد أو تعديل البيانات.',
      demo_edit_note: 'الإضافة والتعديل يتاحان بعد ربط قاعدة البيانات.',
      form_add: 'إضافة ابن / ابنة',
      form_edit: 'تعديل البيانات',
      form_father: 'الأب: {name}',
      f_name: 'الاسم *',
      f_name_en: 'الاسم بالإنجليزية',
      f_name_latin: 'الاسم بالإنجليزية *',
      f_name_ar: 'الاسم بالعربية',
      f_sex: 'الجنس',
      f_unknown: 'غير محدد',
      f_mother: 'اسم الأم',
      f_birth: 'تاريخ الميلاد',
      f_birth_ph: 'مثال: 1950',
      f_death: 'تاريخ الوفاة',
      f_place: 'مكان الميلاد',
      save: 'حفظ',
      name_required: 'الاسم مطلوب',
      added: 'تمت إضافة {name}',
      saved: 'تم حفظ التعديلات',
      confirm_delete: 'حذف «{name}» من الشجرة؟ لا يمكن التراجع عن ذلك.',
      deleted: 'تم الحذف',
      son_of: 'بن',
      daughter_of: 'بنت',
    },
    en: {
      brand: 'Farah Family',
      nav_home: 'Home',
      nav_tree: 'Family Tree',
      lang_switch: 'عربي',
      tree_switch: 'Tree version',
      login: 'Log in',
      logout: 'Log out',
      demo_banner: 'Demo version — data is view-only',
      login_title: 'Log in',
      login_intro: 'Login is available to family members authorized to update the tree.',
      email: 'Email',
      password: 'Password',
      cancel: 'Cancel',
      submit_login: 'Log in',
      bad_credentials: 'Incorrect email or password',
      logged_in: 'Logged in',
      logged_out: 'Logged out',
      demo_no_edit: 'Demo mode: editing is not enabled yet',
      read_only: 'The site is in demo mode. Add the Supabase key in js/config.js to enable editing.',
      load_failed: 'Could not load the data',

      title_home: 'The Farah Family of Nazareth',
      hero_eyebrow: 'Nazareth · Galilee',
      hero_title: 'The Farah Family',
      hero_alt: 'عائلة فرح · الناصرة',
      hero_sub: 'Roots reaching back <span data-stat="generations">13</span> generations, from our forefather Suleiman to the present day.',
      search_ph_home: 'Search a name… e.g. Zuhier Adib',
      search_btn: 'Search',
      about_title: 'Brief History',
      about_history:
        '<p>The origin of the Farah Family goes back to its first ancestor Farah bin Abdullah Al-Qalazi bin Sulieman bin Nimer. It is said the Abduallah Al-Qalazi was the secretary of the Ghazzawiya clan in Sakhra in Jabal Ajloun (Jordan), and he left it because of some incident, apparently in the first half of the seventeenth century.</p>' +
        '<p>Abdullah had 4 sons: Farah (Our Ancestor), Khlief, Nimer and Muhareb. There are accounts stating he had more sons. The descendants of Nimer are the Nmura Clan in the city of Hosn (Irbid District), and is considered one of the oldest and biggest Christian families there. Muhareb converted to Islam, and his descendants are known as Al-Iyal Clan, and it is said that they have joined the Ghazzawiya.</p>' +
        '<p>Abdullah and his sons Farah and Khlief left Sakhra to live near Mount Tabor, then to Al-Shajara village, from there they finally came to Nazareth. The descendants of Farah are the Farah Family in Nazareth, one of the oldest and biggest Christian families, and many family members has since left Nazareth, and their descendants live now in many countries worldwide, especially Flint, Michigan USA.</p>' +
        '<p>The descendants of Khlief are known as Khliefiyye, and they comprise more than ten families in Nazareth. The descendants of Abdullah Al-Qalazi claim descent to Ghassanid Arabs, though no direct proof exists.</p>',
      about_byline: 'Michael Amin Farah – Nazareth',
      about_caption: 'Reserved for a family photo',
      stats_title: 'The Family in Numbers',
      stat_persons: 'recorded members',
      stat_generations: 'generations',
      stat_branches: 'main branches',
      stat_families: 'households',
      origin_title: 'Origins and Branches',
      origin_lead: 'The line from the first ancestor down to Farah, followed by the main branches descending from his grandsons. Click any branch to open it in the tree.',
      arrow: '→',
      cta_title: 'Explore the Family Tree',
      cta_text: 'Browse the generations, search for anyone, and trace their lineage back to the first ancestor.',
      cta_btn: 'Open the interactive tree',
      footer: '© The Farah Family · Nazareth',
      footer_alt: 'عائلة فرح – الناصرة',

      title_tree: 'Farah Family Tree',
      search_ph_tree: 'Search by name, or name and father: Zuhier Adib',
      search_hint: 'Add father and grandfather names to narrow it down',
      expand_all: 'Expand all',
      expand_all_tip: 'Show every generation',
      collapse: 'Collapse',
      collapse_tip: 'Collapse the tree',
      zoom_in: 'Zoom in',
      zoom_out: 'Zoom out',
      zoom_fit: 'Fit to screen',
      loading: 'Loading the tree…',
      tree_failed: 'Could not load the tree: {msg}',
      no_results: 'No results',
      generation: 'Generation {n}',
      male: 'Male',
      female: 'Female',
      n_children: '{n} children',
      n_descendants: '{n} descendants',
      mother: 'Mother',
      born: 'Born',
      birthplace: 'Birthplace',
      died: 'Died',
      notes: 'Notes',
      father: 'Father',
      children_h: 'Children ({n})',
      siblings_h: 'Siblings ({n})',
      ancestry_h: 'Lineage to the first ancestor',
      add_child: '+ Add son / daughter',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      login_to_edit: 'Log in to add family members or edit details.',
      demo_edit_note: 'Adding and editing will be available once the database is connected.',
      form_add: 'Add son / daughter',
      form_edit: 'Edit details',
      form_father: 'Father: {name}',
      f_name: 'Name (Arabic) *',
      f_name_en: 'Name in English',
      f_name_latin: 'Name (English) *',
      f_name_ar: 'Name in Arabic',
      f_sex: 'Sex',
      f_unknown: 'Unknown',
      f_mother: "Mother's name",
      f_birth: 'Date of birth',
      f_birth_ph: 'e.g. 1950',
      f_death: 'Date of death',
      f_place: 'Place of birth',
      save: 'Save',
      name_required: 'Name is required',
      added: 'Added {name}',
      saved: 'Changes saved',
      confirm_delete: 'Delete "{name}" from the tree? This cannot be undone.',
      deleted: 'Deleted',
      son_of: 'son of',
      daughter_of: 'daughter of',
    },
  };

  // Whole names whose English form is not word-by-word.
  const NAME_PHRASES = {
    'ابراهيم الخوري': 'Ibrahim al-Khoury',
    'عبدالله القلزي': 'Abdallah al-Qalazi',
    'لطف الله': 'Lutfallah',
    'جريس المكنى بالدردبا': 'Jiries "al-Dardaba"',
  };

  const NAME_WORDS = {
    'أديب': 'Adib', 'أسعد': 'Asaad', 'اسعد': 'Asaad', 'ألبير': 'Albert', 'البرت': 'Albert', 'أليكس': 'Alex',
    'أمير': 'Amir', 'امير': 'Amir', 'أمين': 'Amin', 'أنور': 'Anwar', 'أيمن': 'Ayman', 'أيوب': 'Ayoub',
    'إبراهيم': 'Ibrahim', 'ابراهيم': 'Ibrahim', 'إدمون': 'Edmond', 'إدوار': 'Edouard', 'ادوار': 'Edouard',
    'ادوارد': 'Edward', 'إسحق': 'Ishaq', 'إسكندر': 'Iskandar', 'اسكندر': 'Iskandar', 'إلياس': 'Elias',
    'الياس': 'Elias', 'إمطانس': 'Imtanes', 'إميل': 'Emil', 'اميل': 'Emil', 'إيلي': 'Elie', 'إيليا': 'Elia',
    'إيهاب': 'Ehab', 'ارنست': 'Ernest', 'ارنستو': 'Ernesto', 'اسامة': 'Osama', 'اسطيفان': 'Estephan',
    'الفرد': 'Alfred', 'اميليو': 'Emilio', 'انطون': 'Antoun', 'باسل': 'Basel', 'باسم': 'Basem',
    'باسيلا': 'Basila', 'بديع': 'Badie', 'بسام': 'Bassam', 'بشارة': 'Bishara', 'بشير': 'Bashir',
    'بطرس': 'Boutros', 'بول': 'Paul', 'بولس': 'Boulos', 'بولص': 'Boulos', 'بيتر': 'Peter', 'تدي': 'Teddy',
    'تروي': 'Troy', 'توفيق': 'Tawfiq', 'جابريئيل': 'Gabriel', 'جاكي': 'Jackie', 'جان': 'Jean', 'جبر': 'Jabr',
    'جبران': 'Jubran', 'جرجي': 'Jurji', 'جريس': 'Jiries', 'جمال': 'Jamal', 'جميل': 'Jamil', 'جود': 'Jude',
    'جودت': 'Jawdat', 'جورج': 'George', 'جوزيف': 'Joseph', 'جول': 'Jules', 'جون': 'John',
    'جوناثان': 'Jonathan', 'حبيب': 'Habib', 'حسن': 'Hasan', 'حسني': 'Husni', 'حسين': 'Husein',
    'حليم': 'Halim', 'حنا': 'Hanna', 'خليف': 'Khalif', 'خليل': 'Khalil', 'داميان': 'Damian', 'ديب': 'Dib',
    'ذياب': 'Thiab', 'رؤوف': 'Raouf', 'راجي': 'Raji', 'راغب': 'Ragheb', 'رامي': 'Rami', 'راني': 'Rani',
    'رايق': 'Rayeq', 'ربيع': 'Rabie', 'رزق': 'Rizq', 'رشد': 'Rushd', 'رضا': 'Rida', 'رفيق': 'Rafiq',
    'رمزي': 'Ramzi', 'روبير': 'Robert', 'روجيه': 'Roger', 'رولاندو': 'Rolando', 'رونان': 'Ronan', 'روي': 'Roy',
    'رياض': 'Riad', 'زاندر': 'Xander', 'زاهر': 'Zaher', 'زاهي': 'Zahi', 'زخريا': 'Zakaria', 'زهير': 'Zuhier',
    'زياد': 'Ziad', 'زين': 'Zain', 'سابا': 'Saba', 'سامر': 'Samer', 'سامي': 'Sami', 'ساهر': 'Saher',
    'سعد': 'Saad', 'سعيد': 'Said', 'سليم': 'Salim', 'سليمان': 'Suleiman', 'سمعان': 'Simaan', 'سميح': 'Sameeh',
    'سمير': 'Samir', 'سهيل': 'Suhail', 'شادي': 'Shadi', 'شبلي': 'Shibli', 'شفيق': 'Shafiq', 'شكري': 'Shukri',
    'صالح': 'Saleh', 'صبحي': 'Subhi', 'صليبا': 'Saliba', 'طناس': 'Tanas', 'طنوس': 'Tannous', 'طوني': 'Tony',
    'عادل': 'Adel', 'عازر': 'Azar', 'عبدالله': 'Abdallah', 'عدنان': 'Adnan', 'عرفان': 'Irfan', 'عزمي': 'Azmi',
    'عزيز': 'Aziz', 'عفيف': 'Afif', 'علاء': 'Alaa', 'عماد': 'Imad', 'عمر': 'Omar', 'عنان': 'Anan',
    'عواد': 'Awad', 'عودة': 'Odeh', 'عوني': 'Awni', 'غسان': 'Ghassan', 'فؤاد': 'Fouad', 'فادي': 'Fadi',
    'فارس': 'Fares', 'فاروق': 'Farouk', 'فايز': 'Fayez', 'فرانكو': 'Franco', 'فرح': 'Farah',
    'فرناندو': 'Fernando', 'فرنسيس': 'Francis', 'فريد': 'Farid', 'فضل': 'Fadel', 'فضول': 'Fadoul',
    'فكتور': 'Victor', 'فهمي': 'Fahmi', 'فهيم': 'Fahim', 'فوزي': 'Fawzi', 'قسطندي': 'Qustandi',
    'كامل': 'Kamel', 'كرم': 'Karam', 'كريستوفر': 'Christopher', 'كمال': 'Kamal', 'كميل': 'Kamil',
    'لؤي': 'Louay', 'لبيب': 'Labib', 'لطف': 'Lutf', 'لطفي': 'Lutfi', 'لويس': 'Louis', 'ماثيو': 'Matthew',
    'مارك': 'Mark', 'ماريو': 'Mario', 'مازن': 'Mazen', 'ماهر': 'Maher', 'مايك': 'Mike', 'مايكل': 'Michael',
    'مجد': 'Majd', 'محارب': 'Mhareb', 'محاسن': 'Mahasen', 'مروان': 'Marwan', 'مكرم': 'Mukarram',
    'منير': 'Munir', 'موسى': 'Musa', 'ميخائيل': 'Mikhael', 'ميشال': 'Michel', 'ميشيل': 'Michel',
    'ميلاد': 'Milad', 'نائل': 'Nael', 'ناجي': 'Naji', 'نادر': 'Nader', 'نازاريو': 'Nazario', 'ناصر': 'Nasser',
    'ناصيف': 'Nassif', 'ناهل': 'Nahel', 'نايف': 'Nayef', 'نجيب': 'Najib', 'نديم': 'Nadim', 'نسيم': 'Nasim',
    'نصرالله': 'Nasrallah', 'نظير': 'Nazir', 'نعمان': 'Nouman', 'نعمة': 'Neameh', 'نعيم': 'Naim',
    'نقولا': 'Nicola', 'نمر': 'Nimer', 'هاني': 'Hani', 'هيثم': 'Haitham', 'وائل': 'Wael', 'واصف': 'Wasef',
    'وديع': 'Wadie', 'ورد': 'Ward', 'وسام': 'Wisam', 'وسيم': 'Wasim', 'وليد': 'Walid', 'ويلفريدو': 'Wilfredo',
    'ويليم': 'William', 'ياسين': 'Yasin', 'يعقوب': 'Yacoub', 'يوحنا': 'Youhanna', 'يوسف': 'Youssef',
    'الخوري': 'Father', 'القلزي': 'al-Qalazi', 'المكنى': 'nicknamed', 'بالدردبا': 'al-Dardaba', 'الله': 'Allah',
  };

  // English -> Arabic for datasets whose names are written in English (keys lower-case).
  // Unknown words are left as they are; a person's own name_ar value overrides this.
  const AR_WORDS = {
    "a'del": 'عادل', "a'lia": 'عاليا', abdallah: 'عبدالله', abdullah: 'عبدالله', abeer: 'عبير', abla: 'عبلة',
    adel: 'عادل', adela: 'أديلا', adele: 'أديل', adib: 'أديب', adibe: 'أديبة', adnan: 'عدنان', afaf: 'عفاف',
    afif: 'عفيف', afife: 'عفيفة', al: '', alaa: 'علاء', alan: 'آلان', albert: 'ألبرت', alex: 'أليكس',
    alfred: 'ألفريد', alice: 'أليس', amal: 'أمل', amani: 'أماني', amin: 'أمين', amir: 'أمير', amira: 'أميرة',
    anan: 'عنان', andrew: 'أندرو', angela: 'أنجيلا', anthos: 'أنثوس', anton: 'أنطون', antonio: 'أنطونيو',
    anwar: 'أنور', areen: 'أرين', arij: 'أريج', arthur: 'آرثر', "asa'ad": 'أسعد', asaad: 'أسعد', asma: 'أسماء',
    assil: 'أصيل', athena: 'أثينا', austin: 'أوستن', awni: 'عوني', awwad: 'عواد', ayda: 'عايدة', ayman: 'أيمن',
    ayoub: 'أيوب', azar: 'عازر', aziz: 'عزيز', azmi: 'عزمي', badie: 'بديع', badira: 'بديرة', bashir: 'بشير',
    bassam: 'بسام', bassem: 'باسم', bassil: 'باسل', bassila: 'باسيلا', ben: 'بن', benjamin: 'بنيامين',
    bishara: 'بشارة', botros: 'بطرس', boulos: 'بولس', carol: 'كارول', caroline: 'كارولين', christina: 'كريستينا',
    christine: 'كريستين', christopher: 'كريستوفر', cindy: 'سيندي', clara: 'كلارا', constantine: 'قسطنطين',
    coral: 'كورال', costandi: 'قسطندي', cynthia: 'سينثيا', damien: 'داميان', dana: 'دانا', daniel: 'دانيال',
    david: 'ديفيد', deeb: 'ديب', diab: 'ذياب', dima: 'ديمة', dina: 'دينا', donald: 'دونالد', edmond: 'إدمون',
    edward: 'إدوارد', ehab: 'إيهاب', el: '', elaine: 'إيلين', eli: 'إيلي', elia: 'إيليا', elianor: 'إليانور',
    elias: 'إلياس', emil: 'إميل', emile: 'إميل', enas: 'إيناس', ernesto: 'إرنستو', evelyn: 'إيفلين',
    faddoul: 'فضول', fadel: 'فضل', fadi: 'فادي', fadia: 'فادية', fahim: 'فهيم', farah: 'فرح', fareed: 'فريد',
    fares: 'فارس', farouq: 'فاروق', faten: 'فاتن', fatinah: 'فتينة', fawzi: 'فوزي', fayez: 'فايز',
    fayzeh: 'فايزة', fernando: 'فرناندو', feryal: 'فريال', feyrouz: 'فيروز', fifi: 'فيفي', fihmi: 'فهمي',
    fouad: 'فؤاد', franco: 'فرانكو', francois: 'فرانسوا', gabriel: 'جبرائيل', george: 'جورج', georges: 'جورج',
    georgette: 'جورجيت', georgy: 'جرجي', ghassan: 'غسان', ghena: 'غنى', gisele: 'جيزيل', gomana: 'جمانة',
    greg: 'غريغ', habib: 'حبيب', hadeel: 'هديل', haifa: 'هيفاء', haisen: 'هيسن', hala: 'هالة', halim: 'حليم',
    hanan: 'حنان', hani: 'هاني', hania: 'هانية', hanna: 'حنا', hasan: 'حسن', haytham: 'هيثم', hector: 'هيكتور',
    helane: 'هيلان', helen: 'هيلين', hiam: 'هيام', hiba: 'هبة', hillario: 'هيلاريو', hind: 'هند', husni: 'حسني',
    hussein: 'حسين', ibrahim: 'إبراهيم', ibtihaj: 'ابتهاج', ikhlas: 'إخلاص', ikram: 'إكرام', imade: 'عماد',
    iman: 'إيمان', imtanis: 'إمطانس', inaam: 'إنعام', inaia: 'عناية', insaf: 'إنصاف', irfan: 'عرفان',
    ishaq: 'إسحق', iskandar: 'إسكندر', itaf: 'عطاف', jaber: 'جابر', jackline: 'جاكلين', jacob: 'يعقوب',
    jaki: 'جاكي', james: 'جيمس', jamal: 'جمال', jameel: 'جميل', jamileh: 'جميلة', jan: 'جان', jason: 'جيسون', jawdat: 'جودت',
    jeff: 'جيف', jenna: 'جينا', jeries: 'جريس', jiries: 'جريس', jihan: 'جيهان', joleen: 'جولين', jolie: 'جولي',
    john: 'جون', jonathan: 'جوناثان', joseph: 'جوزيف', joud: 'جود', joul: 'جول', joulia: 'جوليا', jouna: 'جونا',
    joyce: 'جويس', jr: 'الابن', juan: 'خوان', jubran: 'جبران', julia: 'جوليا', kamal: 'كمال', kamel: 'كامل',
    kamil: 'كميل', kamilia: 'كاميليا', kamle: 'كاملة', karam: 'كرم', karen: 'كارين', kari: 'كاري', katie: 'كيتي',
    katrina: 'كاترينا', kawkab: 'كوكب', kawthar: 'كوثر', kenneth: 'كينيث', ketty: 'كيتي', khalil: 'خليل',
    khlief: 'خليف', khoury: 'الخوري', kim: 'كيم', labeeb: 'لبيب', labib: 'لبيب', laia: 'لايا', laila: 'ليلى',
    lama: 'لمى', lamita: 'لاميتا', laura: 'لورا', layal: 'ليال', layla: 'ليلى', leen: 'لين', leena: 'لينا',
    lilia: 'ليليا', lily: 'ليلي', lindsey: 'ليندسي', liz: 'ليز', loai: 'لؤي', lotfi: 'لطفي', lotof: 'لطف',
    lotofallah: 'لطف الله', louis: 'لويس', lourdi: 'لوردي', luca: 'لوكا', luisito: 'لويسيتو', lydia: 'ليديا',
    madline: 'مادلين', maha: 'مها', mahasen: 'محاسن', maher: 'ماهر', mai: 'مي', majd: 'مجد', makram: 'مكرم',
    manadil: 'مناديل', manal: 'منال', mansour: 'منصور', manuolo: 'مانويلو', maria: 'ماريا', mariam: 'مريم',
    marian: 'ماريان', marilyn: 'ماريلين', mario: 'ماريو', mark: 'مارك', marvet: 'مرفت', marwan: 'مروان',
    mary: 'ماري', max: 'ماكس', mazen: 'مازن', mervat: 'مرفت', "mesa'ade": 'مساعدة', mhareb: 'محارب',
    michael: 'ميخائيل', micheal: 'ميخائيل', michal: 'ميشال', michelle: 'ميشيل', miguel: 'ميغيل', mike: 'مايك',
    milad: 'ميلاد', mildred: 'ميلدريد', mirai: 'ميراي', miriam: 'ميريام', mirna: 'ميرنا', mishleen: 'ميشلين',
    mona: 'منى', mounir: 'منير', mousa: 'موسى', mozayan: 'مزين', muna: 'منى', name: 'بدون اسم', munir: 'منير', nabiha: 'نبيهة',
    nader: 'نادر', nadia: 'نادية', nadim: 'نديم', nadimeh: 'نديمة', nadine: 'نادين', nadwa: 'ندوى',
    naeem: 'نعيم', nael: 'نائل', nagib: 'نجيب', naheel: 'ناهل', nahel: 'ناهل', naim: 'نعيم', naime: 'نعيمة',
    naji: 'ناجي', najla: 'نجلاء', najwan: 'نجوان', nancy: 'نانسي', narmeen: 'نرمين', nasrallah: 'نصرالله',
    nasser: 'ناصر', nassif: 'ناصيف', nassim: 'نسيم', natalie: 'ناتالي', nataly: 'ناتالي', nawal: 'نوال',
    nayef: 'نايف', nayela: 'نايلة', nayfe: 'نايفة', nazario: 'نازاريو', nazeer: 'نظير', nelly: 'نيللي',
    nelson: 'نيلسون', neman: 'نعمان', neme: 'نعمة', neveen: 'نيفين', nicole: 'نيكول', nimer: 'نمر', nina: 'نينا',
    niqoola: 'نقولا', niveen: 'نيفين', nour: 'نور', nuha: 'نهى', odeh: 'عودة', ola: 'علا', omar: 'عمر',
    ophalia: 'أوفيليا', owen: 'أوين', paul: 'بول', paulina: 'بولينا', peter: 'بيتر', qalazi: 'القلزي',
    rabie: 'ربيع', rafik: 'رفيق', rafiq: 'رفيق', ragheb: 'راغب', rahije: 'راحية', raji: 'راجي', rami: 'رامي',
    ramon: 'رامون', ramzi: 'رمزي', rana: 'رنا', randa: 'رندة', rani: 'راني', rania: 'رانيا', raouf: 'رؤوف',
    rasmieh: 'رسمية', rawan: 'روان', rayek: 'رايق', reem: 'ريم', riad: 'رياض', rima: 'ريما', rina: 'رينا',
    rizik: 'رزق', riziq: 'رزق', robert: 'روبرت', roberto: 'روبرتو', rogeh: 'روجيه', rolando: 'رولاندو',
    ronald: 'رونالد', ronan: 'رونان', ronza: 'رونزا', rose: 'روز', roumie: 'رومي', roxy: 'روكسي', roy: 'روي',
    ruba: 'ربى', ruben: 'روبين', rula: 'رلى', saad: 'سعد', saba: 'سابا', sabine: 'سابين', "sae'd": 'سعيد',
    saher: 'ساهر', said: 'سعيد', saleh: 'صالح', saliba: 'صليبا', salim: 'سليم', salma: 'سلمى', salwa: 'سلوى',
    sama: 'سما', samantha: 'سامانثا', samar: 'سمر', samer: 'سامر', sami: 'سامي', samia: 'سامية', samih: 'سميح',
    samir: 'سمير', samira: 'سميرة', sanaa: 'سناء', sandra: 'ساندرا', sarah: 'سارة', sawsan: 'سوسن',
    shaden: 'شادن', shadi: 'شادي', shadia: 'شادية', shafiq: 'شفيق', shahira: 'شهيرة', shaza: 'شذى',
    shibly: 'شبلي', shihade: 'شحادة', shireen: 'شيرين', shirin: 'شيرين', shukri: 'شكري', sileen: 'سيلين',
    silvia: 'سيلفيا', sima: 'سيما', simaan: 'سمعان', skylar: 'سكايلر', sleeman: 'سليمان', soad: 'سعاد',
    souria: 'سورية', souzan: 'سوزان', staci: 'ستايسي', stephan: 'ستيفان', subhi: 'صبحي', suha: 'سهى',
    suhail: 'سهيل', suhaila: 'سهيلة', suhier: 'زهير', summer: 'سمر', tala: 'تالا', tamara: 'تمارا',
    tanas: 'طناس', tannous: 'طنوس', teddy: 'تدي', timothy: 'تيموثي', tony: 'طوني', toufiq: 'توفيق',
    touleen: 'تولين', troy: 'تروي', ussama: 'أسامة', vera: 'فيرا', victor: 'فكتور', victoria: 'فيكتوريا',
    vivian: 'فيفيان', wadie: 'وديع', wael: 'وائل', wafaa: 'وفاء', walid: 'وليد', ward: 'ورد', warde: 'وردة',
    wassef: 'واصف', wassim: 'وسيم', widad: 'وداد', wilfrado: 'ويلفريدو', william: 'ويليم', wissam: 'وسام',
    yaacoub: 'يعقوب', yacoub: 'يعقوب', yana: 'يانا', yanil: 'يانيل', yara: 'يارا', yasmin: 'ياسمين',
    youhana: 'يوحنا', yousef: 'يوسف', yousra: 'يسرى', youssef: 'يوسف', yvonne: 'إيفون', zaher: 'زاهر',
    zahi: 'زاهي', zalfa: 'زلفا', zander: 'زاندر', zein: 'زين', zena: 'زينة', ziad: 'زياد', zuhair: 'زهير',
    zuheir: 'زهير',
  };


  function detect() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'ar') return fromUrl;
    try {
      const saved = localStorage.getItem('farah-lang');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch (e) { /* storage unavailable */ }
    return 'ar';
  }

  // Active dataset (see js/config.js): the language its `name` column is written in.
  const ds = window.FARAH_DATASET || { nameLang: 'ar' };

  const lang = detect();
  try { localStorage.setItem('farah-lang', lang); } catch (e) { /* storage unavailable */ }

  function t(key, vars) {
    let s = STR[lang][key] ?? STR.ar[key] ?? key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  function nameAr(p) {
    if (ds.nameLang === 'ar') return p.name;
    if (p.name_ar) return p.name_ar;
    return (p.name || '').trim().split(/\s+/).map((w) => AR_WORDS[w.toLowerCase()] ?? w).filter(Boolean).join(' ');
  }

  function nameEn(p) {
    if (ds.nameLang === 'en') return (p.name || '').trim();
    if (p.name_en) return p.name_en;
    const name = (p.name || '').trim();
    if (NAME_PHRASES[name]) return NAME_PHRASES[name];
    return name.split(/\s+/).map((w) => NAME_WORDS[w] || w).join(' ');
  }

  function displayName(p) {
    return lang === 'en' ? nameEn(p) : nameAr(p);
  }

  function num(n) {
    return n.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  }

  // Fill elements marked with data-i18n (text), data-i18n-html, data-i18n-placeholder, data-i18n-title.
  function apply(root = document) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    root.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.title = t(el.dataset.i18nTitle);
      el.setAttribute('aria-label', el.title);
    });
  }

  function switchLang() {
    const url = new URL(location.href);
    url.searchParams.set('lang', lang === 'ar' ? 'en' : 'ar');
    location.href = url.toString();
  }

  window.I18N = { lang, t, nameEn, nameAr, displayName, num, apply, switchLang };
  apply();
})();
