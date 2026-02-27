import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true,
})
// This pipe takes a status string and returns a corresponding CSS class for styling. It is used to visually differentiate task statuses in the UI, such as 'completed', 'pending', or 'error'.
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    // The transform method takes a status string as input and returns a CSS class string based on the status value. It uses a switch statement to determine the appropriate class for each status type.
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 font-bold';
      case 'pending':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
}
