// Mock Google Cloud Speech Client
export class SpeechClient {
  constructor(options?: any) {
    // Mock constructor
  }

  recognize = jest.fn().mockResolvedValue([{
    results: [{
      alternatives: [{
        transcript: 'mock transcript'
      }]
    }]
  }])
}
