import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactRequest } from '../../../common/models/contact';
import { ContactService } from '../../../common/services/contact.service';
import { AlertifyService } from '../../../common/services/alertify.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent { 
  contactForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private fb: FormBuilder,
    private contactService: ContactService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    let script = this.renderer2.createElement('script');
    script.text = `
        document.querySelectorAll('.faq .box-container .box h3').forEach(headings => {
            headings.onclick = () => {
                headings.parentElement.classList.toggle('active');
            }
        });
    `;

    this.renderer2.appendChild(this._document.body, script);

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    })
  }

  onSubmit() {
    this.isSubmitted = true;

    const request: ContactRequest = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      phone: this.contactForm.value.phone,
      message: this.contactForm.value.message,
    }

    if (this.contactForm.valid) {
      this.contactService.createContact(request).subscribe(() => {
        this.alertifyService.success('Tin nhắn đã được gửi đi');
      });
      this.isSubmitted = false;
      this.contactForm.reset()
    } else {
      this.alertifyService.error('Đã có lỗi xảy ra vui lòng thử lại!');
    }
  }
}
