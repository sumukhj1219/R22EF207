interface LogData {
  stack: string;
  level: string;
  sourcePackage: string;
  message: string;
}

export function Log(stack: string, level: string, sourcePackage: string, message: string): void {
  const logData: LogData = {
    stack,
    level,
    sourcePackage, 
    message,
  };

  fetch('http://20.244.56.144/evaluation-service/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  })
    .then((response: Response) => {
      if (!response.ok) {
        console.error('Failed to send log to server:', response.statusText);
      }
    })
    .catch((error: Error) => {
      console.error('Error sending log:', error);
    });
}