

class PodcastScriptGenerator {
  constructor() {
    this.form = document.getElementById("podcastForm");
    this.outputSection = document.getElementById("outputSection");
    this.scriptContent = document.getElementById("scriptContent");
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.currentScript = null;

    // Initialize theme
    this.initTheme();

    // Auto-save setup
    this.setupAutoSave();

    this.sampleDataSets = [
      {
        podcastName: "The Mindful Entrepreneur",
        topic: "mental health and entrepreneurship",
        episodeTitle: "Breaking Through Mental Barriers in Business",
        hosts:
          "Sarah — empathetic and insightful; Mike — practical and motivational",
        targetAudience: "entrepreneurs and business professionals",
        tone: "motivational",
        duration: "30",
        includeAds: true,
        includeTimestamps: true,
        includeTagline: true,
      },
      {
        podcastName: "Tech Talk Weekly",
        topic: "artificial intelligence and machine learning",
        episodeTitle: "The Future of AI in Healthcare",
        hosts:
          "Alex — tech-savvy and analytical; Jordan — curious and questioning",
        targetAudience: "tech enthusiasts and healthcare professionals",
        tone: "educational",
        duration: "45",
        includeAds: false,
        includeTimestamps: true,
        includeTagline: true,
      },
      {
        podcastName: "Comedy Corner",
        topic: "everyday life and relationships",
        episodeTitle: "Dating Disasters and Relationship Fails",
        hosts: "Emma — hilarious and witty; Tom — sarcastic and observant",
        targetAudience: "young adults and comedy lovers",
        tone: "funny",
        duration: "20",
        includeAds: true,
        includeTimestamps: false,
        includeTagline: true,
      },
      {
        podcastName: "Business Breakthrough",
        topic: "startup strategies and funding",
        episodeTitle: "From Idea to IPO: A Startup Journey",
        hosts: "David — experienced entrepreneur; Lisa — financial expert",
        targetAudience: "startup founders and investors",
        tone: "professional",
        duration: "60",
        includeAds: true,
        includeTimestamps: true,
        includeTagline: false,
      },
      {
        podcastName: "Heart to Heart",
        topic: "personal growth and self-care",
        episodeTitle: "Finding Your Inner Strength",
        hosts:
          "Maya — compassionate and wise; Chris — supportive and encouraging",
        targetAudience: "people seeking personal development",
        tone: "emotional",
        duration: "25",
        includeAds: false,
        includeTimestamps: true,
        includeTagline: true,
      },
    ];

    this.initializeEventListeners();

    this.renderSampleOptions();

    // Load saved form data
    this.loadSavedFormData();
  }

  initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const savedTheme = localStorage.getItem("theme") || "light";
    
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(themeIcon, savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        this.updateThemeIcon(themeIcon, newTheme);
      });
    }
  }

  updateThemeIcon(icon, theme) {
    if (icon) {
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  setupAutoSave() {
    if (!this.form) return;

    const formInputs = this.form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', () => this.saveFormData());
      input.addEventListener('change', () => this.saveFormData());
    });
  }

  saveFormData() {
    if (!this.form) return;

    const formData = new FormData(this.form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Save checkboxes
    data.includeAds = document.getElementById("includeAds")?.checked || false;
    data.includeTimestamps = document.getElementById("includeTimestamps")?.checked || false;
    data.includeTagline = document.getElementById("includeTagline")?.checked || false;

    try {
      localStorage.setItem("podcastFormData", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save form data:", e);
    }
  }

  loadSavedFormData() {
    try {
      const saved = localStorage.getItem("podcastFormData");
      if (!saved) return;

      const data = JSON.parse(saved);
      
      Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
          if (field.type === "checkbox") {
            field.checked = data[key];
          } else {
            field.value = data[key];
          }
        }
      });
    } catch (e) {
      console.warn("Could not load saved form data:", e);
    }
  }

  initializeEventListeners() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }

    // Output action buttons
    const copyBtn = document.getElementById("copyBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadMarkdownBtn = document.getElementById("downloadMarkdownBtn");
    const printBtn = document.getElementById("printBtn");
    const newScriptBtn = document.getElementById("newScriptBtn");
    const clearStorageBtn = document.getElementById("clearStorageBtn");

    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyScript());
    }
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.downloadScript());
    }
    if (downloadMarkdownBtn) {
      downloadMarkdownBtn.addEventListener("click", () => this.downloadMarkdown());
    }
    if (printBtn) {
      printBtn.addEventListener("click", () => this.printScript());
    }
    if (newScriptBtn) {
      newScriptBtn.addEventListener("click", () => this.resetForm());
    }
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearStorage();
      });
    }

    // Form action buttons
    const fillSampleBtn = document.getElementById("fillSampleBtn");
    const clearFormBtn = document.getElementById("clearFormBtn");

    if (fillSampleBtn) {
      fillSampleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.fillSampleData();
      });
    }

    if (clearFormBtn) {
      clearFormBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearForm();
      });
    }

    // Sample library controls
    const loadSampleBtn = document.getElementById("loadSampleBtn");
    const previewSampleBtn = document.getElementById("previewSampleBtn");
    const sampleSelect = document.getElementById("sampleSelect");
    const sampleSearch = document.getElementById("sampleSearch");

    if (loadSampleBtn) {
      loadSampleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.loadSelectedSample();
      });
    }

    if (previewSampleBtn) {
      previewSampleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.previewSelectedSample();
      });
    }

    if (sampleSearch) {
      sampleSearch.addEventListener("input", (e) => {
        const term = e.target.value || "";
        this.filterSampleOptions(term);
      });
    }

    // Clear validation errors on input
    const formInputs = this.form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
      input.addEventListener('change', () => {
        this.clearFieldError(input);
      });
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    // Clear previous validation errors
    this.clearValidationErrors();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    const formData = new FormData(this.form);
    const podcastData = Object.fromEntries(formData);

    podcastData.includeAds = document.getElementById("includeAds").checked;
    podcastData.includeTimestamps =
      document.getElementById("includeTimestamps").checked;
    podcastData.includeTagline =
      document.getElementById("includeTagline").checked;

    // Disable form during generation
    const generateBtn = this.form.querySelector('.generate-btn');
    if (generateBtn) {
      generateBtn.disabled = true;
    }
    
    this.showLoading();

    try {
      const script = await this.generateScript(podcastData);
      this.currentScript = script;
      this.displayScript(script);
    } catch (error) {
      console.error("Error generating script:", error);
      this.showNotification(
        "Error generating script. Please try again.",
        "error"
      );
    } finally {
      this.hideLoading();
      // Re-enable form after generation
      if (generateBtn) {
        generateBtn.disabled = false;
      }
    }
  }

  validateForm() {
    let isValid = true;
    const requiredFields = ['podcastName', 'topic', 'episodeTitle', 'hosts', 'targetAudience', 'tone', 'duration'];
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        this.showFieldError(field, `${this.getFieldLabel(fieldId)} is required`);
        isValid = false;
      } else {
        this.clearFieldError(field);
      }
    });

    // Validate hosts format
    const hostsField = document.getElementById('hosts');
    if (hostsField && hostsField.value.trim()) {
      const hostsPattern = /^[^;]+(?:[—\-–][^;]+)?(?:;\s*[^;]+(?:[—\-–][^;]+)?)*$/;
      if (!hostsPattern.test(hostsField.value.trim())) {
        this.showFieldError(hostsField, 'Please format hosts as: "Name — description; Name — description"');
        isValid = false;
      }
    }

    if (!isValid) {
      this.showNotification("Please fix the errors in the form", "error");
    }

    return isValid;
  }

  getFieldLabel(fieldId) {
    const labels = {
      podcastName: 'Podcast Name',
      topic: 'Main Topic',
      episodeTitle: 'Episode Title',
      hosts: 'Hosts',
      targetAudience: 'Target Audience',
      tone: 'Tone/Style',
      duration: 'Duration'
    };
    return labels[fieldId] || fieldId;
  }

  showFieldError(field, message) {
    if (!field) return;
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    let errorMsg = field.parentElement.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  clearFieldError(field) {
    if (!field) return;
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  clearValidationErrors() {
    const fields = this.form.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    fields.forEach(field => this.clearFieldError(field));
  }

  async generateScript(data) {

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return this.createScriptContent(data);
  }

  createScriptContent(data) {
    const hosts = this.parseHosts(data.hosts);
    const duration = parseInt(data.duration);
    const segments = this.calculateSegments(duration);

    let script = "";


    script += `🎙️ PODCAST SCRIPT\n`;
    script += `📻 ${data.podcastName}\n`;
    script += `📝 Episode: ${data.episodeTitle}\n`;
    script += `⏱️ Duration: ${data.duration} minutes\n`;
    script += `🎯 Target Audience: ${data.targetAudience}\n`;
    script += `🎭 Tone: ${
      data.tone.charAt(0).toUpperCase() + data.tone.slice(1)
    }\n\n`;

    if (data.includeTagline) {
      script += `🏷️ TAGLINE: "${this.generateTagline(data)}"\n\n`;
    }


    script += `🎵 [INTRO MUSIC - ${this.getIntroMusic(data.tone)}]\n\n`;
    script += `[${this.getTimestamp(0, data.includeTimestamps)}] `;
    script += `${this.generateIntro(data, hosts)}\n\n`;


    const mainSegments = this.generateMainSegments(data, hosts, segments);
    script += mainSegments;


    if (data.includeAds) {
      script += this.generateAdBreaks(data, duration);
    }


    script += this.generateConclusion(data, hosts);


    script += `\n🎵 [OUTRO MUSIC - ${this.getOutroMusic(data.tone)}]\n\n`;
    script += `📱 CALL TO ACTION:\n`;
    script += `• Follow us on social media\n`;
    script += `• Share this episode with friends\n`;
    script += `• Leave us a review on your favorite podcast platform\n`;
    script += `• Visit our website for more content\n\n`;

    script += `🎬 END OF EPISODE\n`;
    script += `Total Runtime: ${data.duration} minutes\n`;
    script += `Generated by Podcast Script Generator`;

    return script;
  }

  parseHosts(hostsString) {
    return hostsString.split(";").map((host) => {
      const parts = host.trim().split("—");
      return {
        name: parts[0].trim(),
        personality: parts[1] ? parts[1].trim() : "engaging",
      };
    });
  }

  calculateSegments(duration) {
    const segments = [];
    const segmentDuration = Math.max(5, Math.floor(duration / 6));


    const segmentTypes = [
      "introduction",
      "main_topic_1",
      "main_topic_2",
      "discussion",
      "examples",
      "conclusion",
    ];

    for (let i = 0; i < 6; i++) {
      segments.push({
        start: i * segmentDuration,
        duration: segmentDuration,
        type: segmentTypes[i],
      });
    }

    return segments;
  }

  generateIntro(data, hosts) {
    const intros = {
      casual: `Hey everyone! Welcome back to ${data.podcastName}. I'm ${hosts[0].name}, and today we're diving into ${data.topic}.`,
      funny: `Well, well, well... look who's back for another episode of ${data.podcastName}! I'm ${hosts[0].name}, and today we're tackling ${data.topic} - and trust me, it's going to be wild!`,
      professional: `Good day, and welcome to ${data.podcastName}. I'm ${hosts[0].name}, and today we'll be exploring ${data.topic} with expert insights and practical takeaways.`,
      educational: `Welcome to ${data.podcastName}, where we make learning fun and accessible. I'm ${hosts[0].name}, and today's topic is ${data.topic}.`,
      emotional: `Hello, beautiful souls. Welcome to ${data.podcastName}. I'm ${hosts[0].name}, and today we're going to have a heartfelt conversation about ${data.topic}.`,
      motivational: `Rise and shine, champions! Welcome to ${data.podcastName}. I'm ${hosts[0].name}, and today we're going to transform your understanding of ${data.topic}.`,
      storytelling: `Once upon a time, in the world of ${data.topic}... Welcome to ${data.podcastName}. I'm ${hosts[0].name}, and today we're going on a journey.`,
    };

    return intros[data.tone] || intros.casual;
  }

  generateMainSegments(data, hosts, segments) {
    let content = "";


    content += `[${this.getTimestamp(
      segments[0].start,
      data.includeTimestamps
    )}] `;
    content += `${this.generateSegmentIntro(data, hosts)}\n\n`;


    content += `[${this.getTimestamp(
      segments[1].start,
      data.includeTimestamps
    )}] `;
    content += `${this.generateMainTopic1(data, hosts)}\n\n`;


    content += `[${this.getTimestamp(
      segments[2].start,
      data.includeTimestamps
    )}] `;
    content += `${this.generateMainTopic2(data, hosts)}\n\n`;


    content += `[${this.getTimestamp(
      segments[3].start,
      data.includeTimestamps
    )}] `;
    content += `${this.generateDiscussion(data, hosts)}\n\n`;


    content += `[${this.getTimestamp(
      segments[4].start,
      data.includeTimestamps
    )}] `;
    content += `${this.generateExamples(data, hosts)}\n\n`;


    content += `[${this.getTimestamp(
      segments[5].start,
      data.includeTimestamps
    )}] `;
    content += `${this.generateSegmentConclusion(data, hosts)}\n\n`;

    return content;
  }

  generateSegmentIntro(data, hosts) {
    const host = hosts[0];
    return `${host.name}: "So today we're talking about ${data.topic}, and I think this is something that really resonates with our audience of ${data.targetAudience}. What got you interested in this topic?"`;
  }

  generateMainTopic1(data, hosts) {
    const facts = this.getTopicFacts(data.topic);
    const host = hosts[0];
    const host2 = hosts[1] || hosts[0];

    return `${host.name}: "Let's dive into the heart of ${data.topic}. Did you know that ${facts.fact}? This is really important because ${facts.importance}."\n\n${host2.name}: "That's fascinating! And what I find particularly interesting is how this connects to our daily lives. For our listeners who are ${data.targetAudience}, this is especially relevant because it directly impacts their decision-making process."\n\n${host.name}: "Absolutely! And there's so much more to explore here. The research shows that understanding ${data.topic} can lead to significant improvements in various areas of life."`;
  }

  generateMainTopic2(data, hosts) {
    const host = hosts[0];
    const host2 = hosts[1] || hosts[0];

    return `${
      host.name
    }: "Now, let's dig deeper into the practical aspects of ${
      data.topic
    }. What are some common misconceptions that people have about this topic?"\n\n${
      host2.name
    }: "Great question! One of the biggest myths I hear is that ${this.getCommonMyth(
      data.topic
    )}. But the reality is quite different. In fact, studies have shown that the opposite is often true."\n\n${
      host.name
    }: "That's such an important distinction to make. And for our audience of ${
      data.targetAudience
    }, understanding these nuances can make all the difference in their approach to this topic."`;
  }

  generateDiscussion(data, hosts) {
    const host1 = hosts[0];
    const host2 = hosts[1] || hosts[0];

    return `${host1.name}: "That's a great point. What I find fascinating is how this connects to our daily lives. Let's talk about the real-world applications of ${data.topic}."\n\n${host2.name}: "Absolutely! And for our listeners who are ${data.targetAudience}, this is particularly relevant because it directly impacts their daily decisions and long-term goals. I've seen firsthand how understanding these concepts can transform someone's approach to this area."\n\n${host1.name}: "That's so true! And I think what makes this even more interesting is how it intersects with other important areas. There's this fascinating connection between ${data.topic} and broader life principles that we should explore."\n\n${host2.name}: "Exactly! And that's why I'm so excited to share some practical strategies that our listeners can implement right away. These aren't just theoretical concepts - they're actionable insights that can make a real difference."`;
  }

  generateExamples(data, hosts) {
    const host1 = hosts[0];
    const host2 = hosts[1] || hosts[0];

    return `${host1.name}: "Let's dive into some concrete examples. I want to share a story that really illustrates the power of understanding ${data.topic}."\n\n${host2.name}: "I love that! Real examples make everything so much clearer. What happened in your story?"\n\n${host1.name}: "Well, there was this situation where someone applied the principles we've been discussing, and the results were remarkable. It really shows how ${data.topic} can be a game-changer when you understand the underlying concepts."\n\n${host2.name}: "That's incredible! And I have a similar example from my own experience. It's amazing how these principles work across different contexts and situations. The key is understanding the fundamentals and then adapting them to your specific circumstances."\n\n${host1.name}: "Absolutely! And that's what makes this so valuable for our audience of ${data.targetAudience}. These aren't one-size-fits-all solutions, but rather frameworks that can be customized to individual needs and goals."`;
  }

  generateSegmentConclusion(data, hosts) {
    const host = hosts[0];
    const host2 = hosts[1] || hosts[0];

    return `${
      host.name
    }: "As we wrap up this segment, I want to leave you with this thought: ${this.getMotivationalQuote(
      data.tone
    )}"\n\n${
      host2.name
    }: "That's so powerful! And I think what we've covered today really shows how ${
      data.topic
    } can be a game-changer for our listeners. The key is taking action on what we've discussed."\n\n${
      host.name
    }: "Absolutely! And remember, our audience of ${
      data.targetAudience
    } has the power to make a real difference. These aren't just concepts - they're tools for transformation."\n\n${
      host2.name
    }: "I couldn't agree more. And if you're listening and this resonates with you, I encourage you to start small. Pick one thing we've discussed today and implement it this week. That's how real change happens."\n\n${
      host.name
    }: "Perfect advice! And don't forget to share your experiences with us. We love hearing from our community about how these ideas are working in your life."`;
  }

  generateAdBreaks(data, duration) {
    const adBreaks = [];
    const adInterval = Math.floor(duration / 3);

    for (let i = 1; i < 3; i++) {
      const time = i * adInterval;
      adBreaks.push(`\n[${this.getTimestamp(time, data.includeTimestamps)}] `);
      adBreaks.push(`🎯 AD BREAK\n`);
      adBreaks.push(
        `"Before we continue, I want to tell you about our amazing sponsor..."\n`
      );
      adBreaks.push(`[30-second ad read]\n`);
      adBreaks.push(
        `"Thanks to our sponsor for supporting the show. Now, back to our conversation..."\n\n`
      );
    }

    return adBreaks.join("");
  }

  generateConclusion(data, hosts) {
    const host = hosts[0];
    const host2 = hosts[1] || hosts[0];

    return `[${this.getTimestamp(
      parseInt(data.duration) - 5,
      data.includeTimestamps
    )}] ${host.name}: "Well, that's a wrap on today's episode about ${
      data.topic
    }. I hope you found this conversation as enlightening as I did."\n\n${
      host2.name
    }: "I absolutely did! And I think what we've covered today really demonstrates the power of understanding ${
      data.topic
    }. For our listeners who are ${
      data.targetAudience
    }, this information can be truly transformative."\n\n${
      host.name
    }: "Couldn't agree more! And I want to emphasize something important - this isn't just theoretical knowledge. These are practical insights that you can start applying immediately. The key is taking that first step."\n\n${
      host2.name
    }: "Exactly! And remember, change doesn't happen overnight. It's about consistent, small actions that compound over time. Start with one thing we discussed today and build from there."\n\n${
      host.name
    }: "Perfect advice! And I want to thank our amazing audience for joining us today. Your engagement and questions make these conversations so much richer."\n\n${
      host2.name
    }: "Absolutely! And if you found value in today's episode, please share it with someone who might benefit. That's how we grow this amazing community of ${
      data.targetAudience
    }."\n\n${
      host.name
    }: "That's the spirit! And don't forget to follow us on social media for daily tips and behind-the-scenes content. We love connecting with our listeners beyond the podcast."\n\n${
      host2.name
    }: "And if you have questions or want to share your own experiences with ${
      data.topic
    }, reach out to us. We read every message and often feature listener stories in future episodes."\n\n${
      host.name
    }: "That's a great point! Your stories and insights make this podcast what it is. So keep those messages coming, and we'll see you next time for another deep dive into topics that matter to our community."`;
  }

  generateTagline(data) {
    const taglines = {
      casual: `The ${data.topic} conversation you didn't know you needed`,
      funny: `Where ${data.topic} meets comedy and chaos`,
      professional: `Expert insights on ${data.topic} for ${data.targetAudience}`,
      educational: `Learn ${data.topic} the fun way`,
      emotional: `Heart-to-heart conversations about ${data.topic}`,
      motivational: `Transform your ${data.topic} journey today`,
      storytelling: `The ${data.topic} story that will change your perspective`,
    };

    return taglines[data.tone] || taglines.casual;
  }

  getIntroMusic(tone) {
    const music = {
      casual: "upbeat, friendly",
      funny: "playful, energetic",
      professional: "sophisticated, clean",
      educational: "inspiring, academic",
      emotional: "warm, gentle",
      motivational: "powerful, uplifting",
      storytelling: "mysterious, engaging",
    };

    return music[tone] || music.casual;
  }

  getOutroMusic(tone) {
    const music = {
      casual: "relaxed, friendly",
      funny: "cheerful, upbeat",
      professional: "professional, clean",
      educational: "satisfying, complete",
      emotional: "warm, comforting",
      motivational: "inspiring, forward-moving",
      storytelling: "conclusive, satisfying",
    };

    return music[tone] || music.casual;
  }

  getTopicFacts(topic) {
    const facts = {
      "mental health": {
        fact: "1 in 4 people will experience a mental health issue in their lifetime",
        importance:
          "understanding mental health helps us support ourselves and others",
      },
      business: {
        fact: "90% of startups fail within their first year",
        importance:
          "learning from failures is crucial for entrepreneurial success",
      },
      technology: {
        fact: "the average person checks their phone 96 times per day",
        importance:
          "technology shapes our daily lives in ways we often don't realize",
      },
      relationships: {
        fact: "strong relationships can increase life expectancy by up to 50%",
        importance: "healthy relationships are fundamental to our well-being",
      },
      "artificial intelligence": {
        fact: "AI is expected to create 97 million new jobs by 2025",
        importance: "understanding AI helps us adapt to the future of work",
      },
      cryptocurrency: {
        fact: "Bitcoin's market cap has grown from $0 to over $1 trillion",
        importance:
          "digital currencies are reshaping the global financial system",
      },
      cooking: {
        fact: "people who cook at home eat 67% more vegetables",
        importance: "home cooking leads to healthier eating habits",
      },
      travel: {
        fact: "travel increases creativity by 50% according to research",
        importance:
          "new experiences broaden our perspectives and problem-solving abilities",
      },
      climate: {
        fact: "renewable energy now costs less than fossil fuels in most countries",
        importance: "sustainable solutions are becoming economically viable",
      },
      gaming: {
        fact: "gamers have 30% better hand-eye coordination than non-gamers",
        importance: "gaming develops valuable cognitive and motor skills",
      },
      meditation: {
        fact: "just 10 minutes of meditation can reduce stress by 25%",
        importance:
          "mindfulness practices have measurable benefits for mental health",
      },
      science: {
        fact: "scientists discover 2.5 million new species each year",
        importance:
          "scientific discovery continues to expand our understanding of the world",
      },
      art: {
        fact: "creating art reduces cortisol levels by 75%",
        importance:
          "artistic expression is a powerful tool for emotional well-being",
      },
      pets: {
        fact: "pet owners have 30% lower risk of heart disease",
        importance: "pets provide significant health and emotional benefits",
      },
      music: {
        fact: "music activates every part of the brain simultaneously",
        importance: "music has unique power to influence mood and cognition",
      },
      gardening: {
        fact: "gardening burns 300-400 calories per hour",
        importance:
          "gardening combines physical activity with mental relaxation",
      },
      nutrition: {
        fact: "intermittent fasting can improve insulin sensitivity by 20-31%",
        importance: "proper nutrition timing can optimize metabolic health",
      },
      finance: {
        fact: "real estate has historically appreciated 3-5% annually",
        importance: "real estate investment can build long-term wealth",
      },
      photography: {
        fact: "portrait photography increases confidence by 85%",
        importance:
          "professional photos can significantly impact personal branding",
      },
      language: {
        fact: "learning a new language increases brain size by 3-4%",
        importance: "bilingualism enhances cognitive flexibility and memory",
      },
      productivity: {
        fact: "deep work sessions of 90 minutes increase productivity by 40%",
        importance: "focused work time is more valuable than multitasking",
      },
      history: {
        fact: "ancient civilizations had advanced knowledge of astronomy",
        importance: "historical study helps us understand human progress",
      },
      spirituality: {
        fact: "meditation reduces anxiety by 60% in just 8 weeks",
        importance: "spiritual practices provide mental and emotional benefits",
      },
      entrepreneurship: {
        fact: "90% of successful startups pivot their original idea",
        importance: "flexibility and adaptation are key to business success",
      },
      comedy: {
        fact: "laughter increases endorphins by 200%",
        importance: "humor is a powerful tool for stress relief and connection",
      },
      wildlife: {
        fact: "dolphins have the largest brain-to-body ratio of any mammal",
        importance:
          "studying animal intelligence helps us understand consciousness",
      },
      fashion: {
        fact: "sustainable fashion reduces water usage by 20%",
        importance: "eco-friendly fashion choices protect our environment",
      },
    };

    return (
      facts[topic.toLowerCase()] || {
        fact: "this topic affects millions of people worldwide",
        importance: "understanding this topic can positively impact your life",
      }
    );
  }

  getCommonMyth(topic) {
    const myths = {
      "mental health": "seeking help is a sign of weakness",
      business: "you need a perfect idea to start a business",
      technology: "AI will replace all human jobs",
      relationships: "love should be effortless and natural",
      "artificial intelligence":
        "AI is too complex for regular people to understand",
      cryptocurrency: "cryptocurrency is just a scam",
      cooking: "cooking healthy food takes too much time",
      travel: "travel is only for the wealthy",
      climate: "individual actions don't matter for climate change",
      gaming: "video games are a waste of time",
      meditation: "meditation requires clearing your mind completely",
      science: "science is only for geniuses",
      art: "you need natural talent to be artistic",
      pets: "pets are just for entertainment",
      music: "you need expensive equipment to make good music",
      gardening: "you need a green thumb to garden successfully",
      nutrition: "skipping meals slows down your metabolism",
      finance: "you need a lot of money to start investing",
      photography: "expensive equipment makes you a better photographer",
      language: "adults can't learn new languages effectively",
      productivity: "multitasking makes you more productive",
      history: "history is just memorizing dates and facts",
      spirituality: "spirituality is only for religious people",
      entrepreneurship: "you need a perfect business plan to start",
      comedy: "you're either funny or you're not",
      wildlife: "animals don't have complex emotions",
      fashion: "sustainable fashion is always more expensive",
    };

    return (
      myths[topic.toLowerCase()] ||
      "this topic is too difficult for most people to understand"
    );
  }

  getMotivationalQuote(tone) {
    const quotes = {
      casual: "every expert was once a beginner",
      funny: "life is what happens when you're busy making other plans",
      professional: "excellence is not a skill, it's an attitude",
      educational: "the only way to do great work is to love what you do",
      emotional: "vulnerability is the birthplace of love, belonging, and joy",
      motivational: "your only limit is your mind",
      storytelling: "every story has the power to change a life",
    };

    return quotes[tone] || quotes.casual;
  }

  getTimestamp(minutes, includeTimestamps) {
    if (!includeTimestamps) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}`
      : `${mins}:00`;
  }

  displayScript(script) {
    // Format script with HTML for better readability
    const formattedScript = this.formatScriptForDisplay(script);
    this.scriptContent.innerHTML = formattedScript;
    this.outputSection.style.display = "block";
    
    // Focus management for accessibility
    const firstAction = this.outputSection.querySelector(".action-btn");
    if (firstAction) {
      firstAction.focus();
    }
    
    this.outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  formatScriptForDisplay(script) {
    // Convert plain text script to formatted HTML
    let html = script
      .split('\n')
      .map(line => {
        if (!line.trim()) return '<br>';
        
        // Format headers/sections
        if (line.match(/^(🎙️|📻|📝|⏱️|🎯|🎭|🏷️|🎵|📱|🎬)/)) {
          return `<div class="script-header">${this.escapeHtml(line)}</div>`;
        }
        
        // Format timestamps
        if (line.match(/^\[[\d:]+]/)) {
          return `<div class="script-timestamp">${this.escapeHtml(line)}</div>`;
        }
        
        // Format ad breaks
        if (line.includes('AD BREAK')) {
          return `<div class="script-ad-break">${this.escapeHtml(line)}</div>`;
        }
        
        // Format speaker names (if detected)
        const speakerMatch = line.match(/^([A-Z][a-z]+):\s*/);
        if (speakerMatch) {
          const speaker = speakerMatch[1];
          const dialogue = line.substring(speaker.length + 1);
          return `<div class="script-speaker"><span class="speaker-name">${speaker}:</span> ${this.escapeHtml(dialogue)}</div>`;
        }
        
        // Regular content
        return `<div class="script-line">${this.escapeHtml(line)}</div>`;
      })
      .join('');
    
    return html;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  copyScript() {
    // Get the plain text version of the script for copying
    const scriptText = this.scriptContent.textContent || this.scriptContent.innerText;
    
    if (!scriptText || !scriptText.trim()) {
      this.showNotification("No script content to copy.", "error");
      return;
    }

    navigator.clipboard
      .writeText(scriptText)
      .then(() => {
        const btn = document.getElementById("copyBtn");
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add("success");
        btn.setAttribute("aria-label", "Script copied to clipboard");

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove("success");
          btn.removeAttribute("aria-label");
        }, 2000);

        this.showNotification("Script copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        // Fallback for older browsers
        this.fallbackCopyText(scriptText);
      });
  }

  fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showNotification("Script copied to clipboard!", "success");
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      this.showNotification("Failed to copy script. Please try again.", "error");
    }
    
    document.body.removeChild(textArea);
  }

  downloadScript() {
    const script = this.currentScript || (this.scriptContent.textContent || this.scriptContent.innerText);
    
    if (!script.trim()) {
      this.showNotification("No script content to download.", "error");
      return;
    }

    // Get podcast name from form for better filename
    const podcastName = document.getElementById("podcastName")?.value || "podcast";
    const episodeTitle = document.getElementById("episodeTitle")?.value || "script";
    const sanitizedPodcastName = podcastName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const sanitizedEpisodeTitle = episodeTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedPodcastName}-${sanitizedEpisodeTitle}-${Date.now()}.txt`;
    a.setAttribute("aria-label", "Download script");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification("Script downloaded successfully!", "success");
  }

  downloadMarkdown() {
    const script = this.currentScript || (this.scriptContent.textContent || this.scriptContent.innerText);
    
    if (!script.trim()) {
      this.showNotification("No script content to download.", "error");
      return;
    }

    // Convert script to Markdown format
    const markdown = this.convertToMarkdown(script);

    // Get podcast name from form for better filename
    const podcastName = document.getElementById("podcastName")?.value || "podcast";
    const episodeTitle = document.getElementById("episodeTitle")?.value || "script";
    const sanitizedPodcastName = podcastName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const sanitizedEpisodeTitle = episodeTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedPodcastName}-${sanitizedEpisodeTitle}-${Date.now()}.md`;
    a.setAttribute("aria-label", "Download script as Markdown");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification("Markdown file downloaded successfully!", "success");
  }

  convertToMarkdown(script) {
    let markdown = script
      .split('\n')
      .map(line => {
        if (!line.trim()) return '';
        
        // Convert headers
        if (line.match(/^(🎙️|📻|📝|⏱️|🎯|🎭|🏷️|🎵|📱|🎬)/)) {
          return `## ${line.replace(/^[🎙️📻📝⏱️🎯🎭🏷️🎵📱🎬]\s*/, '')}`;
        }
        
        // Convert timestamps
        if (line.match(/^\[[\d:]+]/)) {
          return `\n**${line}**\n`;
        }
        
        // Convert ad breaks
        if (line.includes('AD BREAK')) {
          return `\n---\n\n### ${line}\n\n---\n`;
        }
        
        // Convert speaker names
        const speakerMatch = line.match(/^([A-Z][a-z]+):\s*(.+)/);
        if (speakerMatch) {
          return `- **${speakerMatch[1]}**: ${speakerMatch[2]}`;
        }
        
        // Regular content
        return line;
      })
      .filter(line => line !== '')
      .join('\n');
    
    return markdown;
  }

  clearStorage() {
    if (confirm("Are you sure you want to clear all saved data? This will remove your saved form data and theme preference.")) {
      localStorage.removeItem("podcastFormData");
      localStorage.removeItem("theme");
      this.showNotification("All saved data cleared!", "info");
      // Reset theme to light
      document.documentElement.setAttribute("data-theme", "light");
      const themeIcon = document.getElementById("themeIcon");
      if (themeIcon) {
        themeIcon.className = "fas fa-moon";
      }
    }
  }

  printScript() {
    const scriptContent = this.scriptContent.textContent || this.scriptContent.innerText;
    
    if (!scriptContent || !scriptContent.trim()) {
      this.showNotification("No script content to print.", "error");
      return;
    }
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <html>
                <head>
                    <title>Podcast Script</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                        h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
                        .script-content { white-space: pre-wrap; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <h1>Podcast Script</h1>
                    <div class="script-content">${scriptContent}</div>
                </body>
            </html>
        `);
    printWindow.document.close();
    printWindow.print();

    this.showNotification("Print dialog opened!", "info");
  }

  resetForm() {
    this.form.reset();
    this.outputSection.style.display = "none";
    this.currentScript = null;
    // Clear saved form data
    localStorage.removeItem("podcastFormData");
    this.form.scrollIntoView({ behavior: "smooth" });
    this.showNotification("Form reset successfully!", "info");
  }

  fillSampleData() {
    try {
      const sampleDataSets =
        (this.sampleDataSets && this.sampleDataSets.length && this.sampleDataSets) ||
        [
          {
            podcastName: "Quick Sample",
            topic: "general",
            episodeTitle: "Quick Sample Episode",
            hosts: "Host — friendly",
            targetAudience: "everyone",
            tone: "casual",
            duration: "15",
            includeAds: false,
            includeTimestamps: false,
            includeTagline: false,
          },
        ];

      const randomIndex = Math.floor(Math.random() * sampleDataSets.length);
      const sampleData = sampleDataSets[randomIndex];

      this.applySampleToForm(sampleData);
      this.showNotification(
        `Random sample loaded: "${sampleData.podcastName}" - ${sampleData.episodeTitle}. You can now generate a script or modify the fields.`,
        "success"
      );
    } catch (error) {
      console.error("Error filling sample data:", error);
      this.showNotification(
        "Error filling sample data. Please try again.",
        "error"
      );
    }
  }

  applySampleToForm(sampleData) {
    const podcastNameEl = document.getElementById("podcastName");
    const topicEl = document.getElementById("topic");
    const episodeTitleEl = document.getElementById("episodeTitle");
    const hostsEl = document.getElementById("hosts");
    const targetAudienceEl = document.getElementById("targetAudience");
    const toneEl = document.getElementById("tone");
    const durationEl = document.getElementById("duration");
    const includeAdsEl = document.getElementById("includeAds");
    const includeTimestampsEl = document.getElementById("includeTimestamps");
    const includeTaglineEl = document.getElementById("includeTagline");

    if (podcastNameEl) podcastNameEl.value = sampleData.podcastName || "";
    if (topicEl) topicEl.value = sampleData.topic || "";
    if (episodeTitleEl) episodeTitleEl.value = sampleData.episodeTitle || "";
    if (hostsEl) hostsEl.value = sampleData.hosts || "";
    if (targetAudienceEl) targetAudienceEl.value = sampleData.targetAudience || "";
    if (toneEl) toneEl.value = sampleData.tone || "";
    if (durationEl) durationEl.value = sampleData.duration || "";
    if (includeAdsEl) includeAdsEl.checked = !!sampleData.includeAds;
    if (includeTimestampsEl)
      includeTimestampsEl.checked = !!sampleData.includeTimestamps;
    if (includeTaglineEl) includeTaglineEl.checked = !!sampleData.includeTagline;
  }

  renderSampleOptions() {
    const select = document.getElementById("sampleSelect");
    if (!select || !this.sampleDataSets) return;

    select.innerHTML = "";
    this.sampleDataSets.forEach((s, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = `${s.podcastName} — ${s.episodeTitle} (${s.topic})`;
      select.appendChild(opt);
    });
  }

  loadSelectedSample() {
    const select = document.getElementById("sampleSelect");
    if (!select) return this.showNotification("No sample select found", "error");
    const idx = parseInt(select.value, 10);
    if (Number.isNaN(idx) || !this.sampleDataSets[idx]) {
      return this.showNotification("Please choose a valid sample.", "error");
    }
    const sample = this.sampleDataSets[idx];
    this.applySampleToForm(sample);
    this.showNotification(`Loaded sample: ${sample.podcastName}`, "success");
  }

  previewSelectedSample() {
    const select = document.getElementById("sampleSelect");
    if (!select) return this.showNotification("No sample select found", "error");
    const idx = parseInt(select.value, 10);
    if (Number.isNaN(idx) || !this.sampleDataSets[idx]) {
      return this.showNotification("Please choose a valid sample to preview.", "error");
    }
    const sample = this.sampleDataSets[idx];
    const script = this.createScriptContent(sample);
    this.displayScript(script);
  }

  filterSampleOptions(term = "") {
    const select = document.getElementById("sampleSelect");
    if (!select) return;
    const q = term.toLowerCase().trim();
    select.innerHTML = "";
    this.sampleDataSets.forEach((s, idx) => {
      const combined = `${s.podcastName} ${s.episodeTitle} ${s.topic}`.toLowerCase();
      if (!q || combined.includes(q)) {
        const opt = document.createElement("option");
        opt.value = String(idx);
        opt.textContent = `${s.podcastName} — ${s.episodeTitle} (${s.topic})`;
        select.appendChild(opt);
      }
    });
  }

  clearForm() {
    if (confirm("Are you sure you want to clear all form data?")) {
      this.form.reset();
      this.showNotification("Form cleared successfully!", "info");
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
      notification.style.transform = "translateX(0)";
    });

    // Auto-remove after delay
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showLoading() {
    this.loadingOverlay.style.display = "flex";
  }

  hideLoading() {
    this.loadingOverlay.style.display = "none";
  }
}


function initializeApp() {
  try {
    new PodcastScriptGenerator();
  } catch (error) {
    console.error("Error initializing PodcastScriptGenerator:", error);
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'notification notification-error';
    errorDiv.style.display = 'block';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.transform = 'translateX(0)';
    errorDiv.innerHTML = '<div class="notification-content"><i class="fas fa-exclamation-circle"></i><span>Failed to initialize application. Please refresh the page.</span></div>';
    document.body.appendChild(errorDiv);
  }
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {

  initializeApp();
}