import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
	transform(value: string, length: number = 30): string {
		if (value.length > length) {
			return value.slice(0, length) + '...';
		}
		return value;
	}
}
