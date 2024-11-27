import cv2
import os
import json
import tempfile
import numpy as np
from datetime import datetime

import sys


print("Python Path:", sys.path)
print("Current Working Directory:", os.getcwd())

try:
    import cv2
    print("OpenCV Version:", cv2.__version__)
    print("OpenCV Path:", cv2.__file__)
except ImportError as e:
    print("Import Error Details:", e)
    print("Installed Packages:", os.popen('pip list').read())

class VideoNSFWDetector:
    def __init__(self):
        """Initialize the NSFW detector with a temporary directory."""
        try:
            from nudenet import NudeDetector
            self.detector = NudeDetector()
            # Use system's temporary directory
            self.temp_dir = tempfile.mkdtemp(prefix='nsfw_detector_')
        except ImportError:
            raise ImportError("NudeDetector library not found. Install it using 'pip install nudenet'")

    def extract_frames(self, video_path, num_frames=10):
        """Extract frames from video for analysis using a temporary directory."""
        frames = []
        video = cv2.VideoCapture(video_path)
        total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        interval = max(1, total_frames // num_frames)

        for i in range(num_frames):
            video.set(cv2.CAP_PROP_POS_FRAMES, i * interval)
            ret, frame = video.read()
            if ret:
                # Use temporary directory for frame storage
                frame_path = os.path.join(self.temp_dir, f"temp_frame_{i}.jpg")
                cv2.imwrite(frame_path, frame)
                frames.append(frame_path)

        video.release()
        return frames

    def is_nsfw(self, video_path, threshold=0.6):
        """Check if video contains NSFW content based on frame analysis."""
        try:
            frames = self.extract_frames(video_path)
            max_score = 0
            details = []

            # Analyze frames for NSFW content
            for frame in frames:
                detection = self.detector.detect(frame)
                if detection:
                    score = max([pred['score'] for pred in detection])
                    max_score = max(max_score, score)

                    details.append({
                        'frame': os.path.basename(frame),
                        'score': score,
                        'detections': len(detection)
                    })

            # Clean up temporary directory and all its contents
            self._cleanup_temp_dir()

            # Determine if the video is NSFW based on threshold
            is_nsfw = max_score > threshold

            # Return detailed result
            return {
                'is_nsfw': is_nsfw,
                'confidence': max_score,
                'details': details,
                'timestamp': str(datetime.now())
            }

        except Exception as e:
            # Ensure cleanup even if an error occurs
            self._cleanup_temp_dir()
            return {
                'error': str(e),
                'is_nsfw': True  # Fail safe, assuming NSFW in case of error
            }

    def _cleanup_temp_dir(self):
        """Safely remove the temporary directory and its contents."""
        try:
            import shutil
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
        except Exception as e:
            print(f"Error cleaning up temporary directory: {e}")

def save_result(result, output_path):
    """Save the result to a JSON file."""
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=4)

def detect_nsfw(video_path, output_path):
    """Wrapper function to handle detection and result saving."""
    detector = VideoNSFWDetector()
    result = detector.is_nsfw(video_path)
    save_result(result, output_path)
    print(f"NSFW detection completed for {video_path}, results saved to {output_path}")

if __name__ == "__main__":
    import sys

    # Command-line argument handling
    if len(sys.argv) != 3:
        print("Usage: python nsfw_detector.py  ", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]
    output_path = sys.argv[2]

    # Perform NSFW detection
    detect_nsfw(video_path, output_path)