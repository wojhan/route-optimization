import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmRemoveModal } from '@route-optimizer/shared/components/confirm-remove-modal/confirm-remove.modal';
import { filter, switchMap } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  showDeleteModal(content: string, width?: number): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmRemoveModal, {
      width: (width ? width : 250) + 'px',
      data: {
        content,
        ok: true
      }
    });

    return dialogRef.afterClosed();
  }
}
