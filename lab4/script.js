'use strict';

const cssVar = (name) =>
    getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

const CONSOLE_COLORS = {
    accent: cssVar('--color-accent') || '#624b91',
    primary: cssVar('--color-primary') || '#49366f',
    muted: cssVar('--color-text-muted') || '#6b6284',
};

class SpellApplication {
    static count = 0;

    constructor({ name, email, password, agreement }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.agreement = agreement;
        this.createdAt = new Date();

        SpellApplication.count += 1;
        this.id = SpellApplication.count;
    }

    get maskedPassword() {
        return '*'.repeat(this.password.length);
    }

    get formattedDate() {
        return this.createdAt.toLocaleString('ru-RU');
    }

    printFormatted() {
        console.groupCollapsed(
            `%c🪄 Заявка №${this.id} — ${this.name}`,
            `color: ${CONSOLE_COLORS.accent}; font-weight: bold; font-size: 14px;`
        );

        const rows = [
            ['Имя мага', this.name],
            ['Почта', this.email],
            ['Пароль', this.maskedPassword],
            ['Согласие', this.agreement ? 'дано' : 'не дано'],
            ['Создана', this.formattedDate],
        ];

        const labelStyle =
            `color: ${CONSOLE_COLORS.primary}; font-weight: bold;`;

        const valueStyle =
            `color: ${CONSOLE_COLORS.accent};`;

        rows.forEach(([label, value]) => {
            console.log(
                `%c${label}:%c ${value}`,
                labelStyle,
                valueStyle
            );
        });

        console.table(Object.fromEntries(rows));

        console.log(
            `%cВсего заявок: ${SpellApplication.count}`,
            `color: ${CONSOLE_COLORS.muted}; font-style: italic;`
        );

        console.groupEnd();
    }

    getSummary() {
        return `Заявка №${this.id}: ${this.name} (${this.email})`;
    }
}

const form = document.getElementById('application-form');
const statusBox = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const application = new SpellApplication({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            agreement: formData.get('agreement') === 'on',
        });

        application.printFormatted();

        if (statusBox) {
            statusBox.textContent =
                `${application.getSummary()}. Объект создан и выведен в консоль.`;

            statusBox.classList.add('form-status--visible');
        }

        form.reset();
    });
}
