class VoiceChatbot {
    constructor() {
        // Connect to server based on environment
        const serverUrl = window.location.hostname === 'localhost' 
            ? window.location.origin 
            : window.location.origin;
        
        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true
        });
        
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.isConversationStarted = false;
        this.isProcessing = false;
        this.audioStream = null;
        
        this.initializeElements();
        this.initializeSocketListeners();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.micBtn = document.getElementById('micBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.textInput = document.getElementById('textInput');
        this.sendTextBtn = document.getElementById('sendTextBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = this.statusIndicator.querySelector('.status-text');
        this.chatMessages = document.getElementById('chatMessages');
        this.waveContainer = document.getElementById('waveContainer');
    }

    initializeSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.updateStatus('Connected', 'ready');
        });

        this.socket.on('conversation_started', (data) => {
            this.isConversationStarted = true;
            this.addMessage(data.message, 'ai');
            this.updateStatus('Ready to talk', 'ready');
            this.enableMicButton();
            this.enableTextInput();
        });

        this.socket.on('ai_response', (data) => {
            this.isProcessing = false;
            this.addMessage(data.text, 'ai');
            this.updateStatus('Ready to talk', 'ready');
            this.enableMicButton();
            this.enableTextInput();
        });

        this.socket.on('ai_audio', (data) => {
            this.playAudioResponse(data.audio, data.mimeType);
        });

        this.socket.on('interruption_acknowledged', () => {
            this.isProcessing = false;
            this.updateStatus('Interrupted - Ready to talk', 'ready');
            this.enableMicButton();
            this.enableTextInput();
        });

        this.socket.on('error', (data) => {
            console.error('Server error:', data.message);
            this.updateStatus(`Error: ${data.message}`, 'error');
            this.isProcessing = false;
            this.enableMicButton();
            this.enableTextInput();
        });

        this.socket.on('disconnect', () => {
            this.updateStatus('Disconnected', 'error');
            this.disableMicButton();
            this.disableTextInput();
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.updateStatus('Connection failed', 'error');
        });
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startConversation());
        this.micBtn.addEventListener('mousedown', () => this.startRecording());
        this.micBtn.addEventListener('mouseup', () => this.stopRecording());
        this.micBtn.addEventListener('mouseleave', () => this.stopRecording());
        this.stopBtn.addEventListener('click', () => this.stopConversation());
        this.sendTextBtn.addEventListener('click', () => this.sendTextMessage());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendTextMessage();
            }
        });

        // Touch events for mobile
        this.micBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startRecording();
        });
        this.micBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopRecording();
        });
    }

    async startConversation() {
        try {
            this.updateStatus('Starting conversation...', 'processing');
            this.startBtn.disabled = true;
            
            this.socket.emit('start_conversation');
            
        } catch (error) {
            console.error('Error starting conversation:', error);
            this.updateStatus('Failed to start conversation', 'error');
            this.startBtn.disabled = false;
        }
    }

    sendTextMessage() {
        const text = this.textInput.value.trim();
        if (!text) return;

        if (!this.isConversationStarted) {
            this.addMessage('Please start a conversation first', 'system');
            return;
        }

        // Add user message to chat
        this.addMessage(text, 'user');
        
        // Clear input
        this.textInput.value = '';
        
        // Send text message to server
        this.socket.emit('text_message', { text: text });
        
        // Show processing state
        this.isProcessing = true;
        this.updateStatus('Processing...', 'processing');
        this.disableMicButton();
        this.disableTextInput();
    }

    async startRecording() {
        if (!this.isConversationStarted || this.isProcessing) {
            console.log('Cannot start recording: conversation not started or processing');
            return;
        }

        try {
            // Request microphone access with specific constraints
            this.audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });

            // Check for supported MIME types
            const supportedTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/mp4',
                'audio/wav'
            ];

            let selectedType = null;
            for (const type of supportedTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    selectedType = type;
                    break;
                }
            }

            if (!selectedType) {
                throw new Error('No supported audio format found');
            }

            console.log('Using audio format:', selectedType);

            this.mediaRecorder = new MediaRecorder(this.audioStream, {
                mimeType: selectedType
            });

            this.audioChunks = [];
            this.isRecording = true;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                    console.log('Audio chunk received, size:', event.data.size);
                }
            };

            this.mediaRecorder.onstop = () => {
                console.log('Recording stopped, processing audio...');
                this.processAudio();
            };

            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                this.updateStatus('Recording error', 'error');
                this.isRecording = false;
                this.enableMicButton();
            };

            this.mediaRecorder.start(100); // Collect data every 100ms
            this.updateStatus('Listening...', 'listening');
            this.micBtn.classList.add('recording');
            this.showWaveAnimation();

        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.updateStatus(`Microphone error: ${error.message}`, 'error');
            this.isRecording = false;
            this.enableMicButton();
        }
    }

    stopRecording() {
        if (!this.isRecording) return;

        console.log('Stopping recording...');
        this.isRecording = false;
        this.micBtn.classList.remove('recording');
        this.hideWaveAnimation();

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => {
                track.stop();
            });
            this.audioStream = null;
        }
    }

    async processAudio() {
        if (this.audioChunks.length === 0) {
            console.log('No audio chunks to process');
            this.enableMicButton();
            return;
        }

        try {
            this.isProcessing = true;
            this.updateStatus('Processing...', 'processing');
            this.disableMicButton();

            const audioBlob = new Blob(this.audioChunks, { 
                type: this.mediaRecorder.mimeType 
            });
            
            console.log('Audio blob created, size:', audioBlob.size, 'type:', audioBlob.type);
            
            if (audioBlob.size === 0) {
                throw new Error('Empty audio recording');
            }

            const base64Audio = await this.blobToBase64(audioBlob);
            console.log('Audio converted to base64, length:', base64Audio.length);

            // Send audio to server
            this.socket.emit('audio_data', {
                audio: base64Audio,
                mimeType: audioBlob.type
            });

            // Add user message placeholder
            this.addMessage('🎤 [Voice message]', 'user');

        } catch (error) {
            console.error('Error processing audio:', error);
            this.updateStatus(`Error processing audio: ${error.message}`, 'error');
            this.isProcessing = false;
            this.enableMicButton();
        }
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => {
                reject(new Error('Failed to convert blob to base64'));
            };
            reader.readAsDataURL(blob);
        });
    }

    playAudioResponse(audioData, mimeType) {
        try {
            console.log('Playing audio response, mimeType:', mimeType);
            
            const audioBlob = new Blob([
                Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
            ], { type: mimeType });
            
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
            };
            
            audio.onerror = (error) => {
                console.error('Error playing audio:', error);
                URL.revokeObjectURL(audioUrl);
            };
            
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } catch (error) {
            console.error('Error creating audio response:', error);
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'user' ? 'fas fa-user' : 
                   sender === 'ai' ? 'fas fa-robot' : 
                   'fas fa-info-circle';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="${icon}"></i>
                <p>${text}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updateStatus(text, type) {
        this.statusText.textContent = text;
        this.statusText.className = `status-text ${type}`;
    }

    enableMicButton() {
        this.micBtn.disabled = false;
        this.stopBtn.disabled = false;
    }

    disableMicButton() {
        this.micBtn.disabled = true;
        this.stopBtn.disabled = true;
    }

    enableTextInput() {
        this.textInput.disabled = false;
        this.sendTextBtn.disabled = false;
    }

    disableTextInput() {
        this.textInput.disabled = true;
        this.sendTextBtn.disabled = true;
    }

    showWaveAnimation() {
        this.waveContainer.style.display = 'block';
    }

    hideWaveAnimation() {
        this.waveContainer.style.display = 'none';
    }

    stopConversation() {
        if (this.isRecording) {
            this.stopRecording();
        }
        
        this.socket.emit('interrupt');
        this.isConversationStarted = false;
        this.startBtn.disabled = false;
        this.disableMicButton();
        this.disableTextInput();
        this.updateStatus('Conversation stopped', 'ready');
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceChatbot();
}); 