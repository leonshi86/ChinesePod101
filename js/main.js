// ChinesePod101 - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('ChinesePod101 loaded!');
    
    // Audio player simulation
    const playButtons = document.querySelectorAll('.play-icon, .player-placeholder');
    playButtons.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function() {
            alert('🎧 Audio Lesson\n\nLesson 1: 你好 (Hello)\n\nIn production, this would play the audio lesson.');
        });
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Progress tracking
    window.saveProgress = function(lessonId) {
        const progress = JSON.parse(localStorage.getItem('chinesepod101_progress') || '{}');
        progress[lessonId] = true;
        localStorage.setItem('chinesepod101_progress', JSON.stringify(progress));
        alert('Progress saved!');
    };
    
    window.getProgress = function() {
        return JSON.parse(localStorage.getItem('chinesepod101_progress') || '{}');
    };
});

// Text-to-speech
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}