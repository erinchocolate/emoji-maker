import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import crypto from 'crypto';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log('API Token:', process.env.REPLICATE_API_TOKEN?.slice(0, 5) + '...');

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Generating emoji for prompt:', prompt);

    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          width: 1024,
          height: 1024,
          prompt: "a Tok emoji of " + prompt,
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 50
        }
      }
    );

    console.log('Replicate output:', output); // Debug log

    // Handle the stream response
    if (Array.isArray(output) && output[0] instanceof ReadableStream) {
      const stream = output[0];
      const reader = stream.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      // Combine chunks into a Uint8Array
      const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        concatenated.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Convert to base64
      const base64 = Buffer.from(concatenated).toString('base64');
      const dataUrl = `data:image/png;base64,${base64}`;

      return NextResponse.json({ output: [dataUrl] });
    }

    // If output is already in the correct format (URLs)
    if (Array.isArray(output)) {
      return NextResponse.json({ output });
    }

    return NextResponse.json({ 
      error: 'Invalid response from model' 
    }, { status: 500 });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Failed to generate emoji', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 