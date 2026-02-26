import { redisClient } from '../redis';

interface QueueJob {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'activity_log_queue';
const MAX_RETRIES = 3;

export async function enqueueActivityLog(data: any): Promise<void> {
  try {
    const job: QueueJob = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'activity_log',
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    // Push to Redis queue (FIFO)
    if (redisClient.isOpen) {
      await redisClient.rPush(QUEUE_KEY, JSON.stringify(job));
    }
  } catch (error) {
    console.error('Failed to enqueue activity log:', error);
    // Don't throw - queue failure shouldn't break main request
  }
}

export async function processActivityLogQueue(): Promise<void> {
  const { db } = await import('../db');
  const { trxLogAktivitas } = await import('../db/schema');

  try {
    while (true) {
      // Get next job from queue (blocking pop with 10s timeout)
      try {
        const jobData = await redisClient.blPop(QUEUE_KEY, 10);

        if (!jobData) {
          // Timeout - continue waiting
          continue;
        }

        try {
          const job = JSON.parse(jobData.element) as QueueJob;

          // Insert into database
          await db.insert(trxLogAktivitas).values(job.data);

          console.log(`✅ Activity log processed: ${job.id}`);
        } catch (error) {
          console.error('Error processing activity log:', error);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('BLPOP')) {
          // Redis connection lost, try to reconnect
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }
  } catch (error) {
    console.error('Activity log queue worker error:', error);
  }
}

export async function startActivityLogWorker(): Promise<void> {
  console.log('🔄 Starting activity log queue worker...');
  // Run worker in background, don't await
  processActivityLogQueue().catch((err) => {
    console.error('Activity log worker crashed:', err);
    // Restart after delay
    setTimeout(() => startActivityLogWorker(), 5000);
  });
}
