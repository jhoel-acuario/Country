import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  private debouncer = new Subject<string>();
  private debouncerSuscription?: Subscription

  @Input()
  public placeholder: string = '';

  @Input()
  public initValue :string='';

  @Output()
  public onDebounce = new EventEmitter<string>();
  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(300)).subscribe((value) => {
      console.log('debouncer value', value);
      this.onDebounce.emit(value);
    });
  }

 /*  emitValue(value: string): void {
    this.onValue.emit(value);
  } */
  onKeyPress(searchTerm: string) {
    this.debouncer.next(searchTerm);
  }
  ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe()
    console.log('destruido');
  }
}
