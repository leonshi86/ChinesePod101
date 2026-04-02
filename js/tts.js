// ChinesePod101 - Enhanced TTS System
// Supports: Edge Browser TTS (Free) + Azure TTS (Premium)

const TTS_CONFIG = {
    // 默认使用 Edge 浏览器语音（免费，发音较好）
    defaultProvider: 'edge',
    
    // Azure TTS 配置（可选，需要填写 API Key）
    azure: {
        enabled: false,  // 设为 true 启用 Azure
        region: 'eastasia',  // 区域
        key: '',  // 填入你的 Azure Speech Key
        voice: 'zh-CN-XiaoxiaoNeural'  // 最佳中文女声
    }
};

// 可用的中文语音列表（按质量排序）
let chineseVoices = [];

// 初始化语音
function initVoices() {
    if ('speechSynthesis' in window) {
        // 获取所有语音
        const allVoices = speechSynthesis.getVoices();
        
        // 筛选中文语音（优先选择高质量的）
        chineseVoices = allVoices.filter(voice => 
            voice.lang.startsWith('zh') || 
            voice.lang.startsWith('cmn')
        ).sort((a, b) => {
            // 优先选择 Microsoft/Google 的语音
            const aScore = a.name.includes('Microsoft') ? 2 : 
                          a.name.includes('Google') ? 1 : 0;
            const bScore = b.name.includes('Microsoft') ? 2 : 
                          b.name.includes('Google') ? 1 : 0;
            return bScore - aScore;
        });
        
        console.log('Available Chinese voices:', chineseVoices.map(v => v.name));
    }
}

// 页面加载时初始化
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = initVoices;
    initVoices();
}

// Edge 浏览器 TTS（免费方案）
function speakWithEdge(text) {
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音播放');
        return;
    }
    
    // 取消之前的播放
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 选择最佳中文语音
    if (chineseVoices.length > 0) {
        // 优先选择 Microsoft Xiaoxiao 或 Yunxi（Edge浏览器内置）
        const preferredVoice = chineseVoices.find(v => 
            v.name.includes('Xiaoxiao') || 
            v.name.includes('Yunxi') ||
            v.name.includes('Microsoft')
        ) || chineseVoices[0];
        
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name);
    }
    
    // 优化参数
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;  // 稍慢一点，更清晰
    utterance.pitch = 1.0;  // 正常音调
    utterance.volume = 1.0; // 最大音量
    
    speechSynthesis.speak(utterance);
}

// Azure TTS（高质量，需要API Key）
async function speakWithAzure(text) {
    if (!TTS_CONFIG.azure.enabled || !TTS_CONFIG.azure.key) {
        console.log('Azure TTS not configured, falling back to Edge');
        speakWithEdge(text);
        return;
    }
    
    try {
        const response = await fetch(`https://${TTS_CONFIG.azure.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': TTS_CONFIG.azure.key,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
            },
            body: `
                <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'>
                    <voice name='${TTS_CONFIG.azure.voice}'>
                        ${text}
                    </voice>
                </speak>
            `
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } else {
            throw new Error('Azure TTS failed');
        }
    } catch (error) {
        console.error('Azure TTS error:', error);
        speakWithEdge(text); // 降级到 Edge
    }
}

// 主播放函数
function speak(text) {
    if (TTS_CONFIG.azure.enabled && TTS_CONFIG.azure.key) {
        speakWithAzure(text);
    } else {
        speakWithEdge(text);
    }
}

// 批量播放（用于例句）
function speakSentence(chinese, pinyin = '') {
    if (pinyin) {
        // 先播放中文，再播放拼音
        speak(chinese);
        setTimeout(() => speak(pinyin), 1500);
    } else {
        speak(chinese);
    }
}

// 测试语音
function testVoice() {
    speak('你好，欢迎使用 ChinesePod101');
}

// 导出函数供页面使用
window.speak = speak;
window.speakSentence = speakSentence;
window.testVoice = testVoice;