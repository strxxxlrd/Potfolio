// ============================================================
//  PORTFOLIO — Yura Spirin
//  Все эффекты: курсор, магнит, hover-img, smooth scroll,
//               scroll reveal, hero anim, burger menu
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ════════════════════════════════════════════════
    // 1. SMOOTH SCROLL — Lenis
    // ════════════════════════════════════════════════
    let lenis = null;

    if (!prefersReduced && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function rafLoop(time) {
            lenis.raf(time);
            requestAnimationFrame(rafLoop);
        }
        requestAnimationFrame(rafLoop);
    }

    // ════════════════════════════════════════════════
    // 2. HEADER — scroll класс
    // ════════════════════════════════════════════════
    const headerEl = document.querySelector('header');
    if (headerEl) {
        const onScroll = () => {
            headerEl.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ════════════════════════════════════════════════
    // 3. BURGER MENU
    // ════════════════════════════════════════════════
    const burgerBtn  = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burgerBtn && mobileMenu) {
        let menuOpen = false;

        const openMenu = () => {
            menuOpen = true;
            burgerBtn.classList.add('is-open');
            burgerBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        };

        const closeMenu = () => {
            menuOpen = false;
            burgerBtn.classList.remove('is-open');
            burgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        };

        burgerBtn.addEventListener('click', () => {
            menuOpen ? closeMenu() : openMenu();
        });

        // Закрыть при клике на ссылку
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Закрыть на Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && menuOpen) closeMenu();
        });
    }

    // ════════════════════════════════════════════════
    // 4. CUSTOM CURSOR
    // ════════════════════════════════════════════════
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');

    if (cursor && ring && !isTouchDevice) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top  = my + 'px';
        });

        (function followRing() {
            rx += (mx - rx) * 0.13;
            ry += (my - ry) * 0.13;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(followRing);
        })();

        document.querySelectorAll('a, button, .project').forEach(el => {
            el.addEventListener('mouseenter', () => {
                ring.style.transform   = 'translate(-50%,-50%) scale(2.2)';
                ring.style.borderColor = 'rgba(40,36,36,0.4)';
                cursor.style.transform = 'translate(-50%,-50%) scale(0.4)';
            });
            el.addEventListener('mouseleave', () => {
                ring.style.transform   = 'translate(-50%,-50%) scale(1)';
                ring.style.borderColor = '#282424';
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            ring.style.opacity   = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            ring.style.opacity   = '1';
        });
    }

    // ════════════════════════════════════════════════
    // 5. MAGNETIC BUTTON
    // ════════════════════════════════════════════════
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const cx = r.left + r.width  / 2;
            const cy = r.top  + r.height / 2;
            const dx = (e.clientX - cx) * 0.4;
            const dy = (e.clientY - cy) * 0.4;
            el.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
            el.style.transform  = 'translate(0, 0)';
            setTimeout(() => el.style.transition = '', 500);
        });
    });

    // ════════════════════════════════════════════════
    // 6. HOVER IMAGE на проектах (только не touch)
    // ════════════════════════════════════════════════
    const hoverCard = document.getElementById('project-hover-card');
    const hoverImg  = document.getElementById('project-hover-img');

    if (hoverCard && hoverImg && !isTouchDevice) {
        const projectImages = {
            'TWICE'    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
            'The Damai': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&q=80',
            'Fabrik'   : 'https://images.unsplash.com/photo-1614728263952-84ea256f9d4b?w=500&q=80',
            'Aakka d'  : 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=500&q=80',
        };

        let cardX = 0, cardY = 0, targetX = 0, targetY = 0;
        let animating = false;

        function animateCard() {
            cardX += (targetX - cardX) * 0.1;
            cardY += (targetY - cardY) * 0.1;
            hoverCard.style.left = cardX + 'px';
            hoverCard.style.top  = cardY + 'px';
            if (animating) requestAnimationFrame(animateCard);
        }

        document.querySelectorAll('.project').forEach(project => {
            const name = project.querySelector('span')?.textContent?.trim();

            project.addEventListener('mouseenter', () => {
                const img = projectImages[name];
                if (!img) return;
                hoverImg.src = img;
                hoverCard.classList.add('visible');
                animating = true;
                animateCard();
            });

            project.addEventListener('mousemove', e => {
                targetX = e.clientX + 24;
                targetY = e.clientY - 100;
            });

            project.addEventListener('mouseleave', () => {
                hoverCard.classList.remove('visible');
                animating = false;
            });
        });
    }

    // ════════════════════════════════════════════════
    // 7. SCROLL REVEAL
    // ════════════════════════════════════════════════
    if (!prefersReduced && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('sr-visible');
                    }, i * 60);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.sr').forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.sr').forEach(el => el.classList.add('sr-visible'));
    }

    // ════════════════════════════════════════════════
    // 8. CIRCULAR REVEAL — Contact
    // ════════════════════════════════════════════════
    const contactSection = document.querySelector('.contact');
    const contactWrapper = document.querySelector('.contact-wrapper');

    if (contactSection && contactWrapper) {
        if (prefersReduced) {
            contactSection.classList.add('is-visible');
        } else {
            const contactObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        contactSection.classList.add('is-visible');
                        contactObserver.unobserve(contactWrapper);
                    }
                });
            }, { threshold: 0.1 });
            contactObserver.observe(contactWrapper);
        }
    }

    // ════════════════════════════════════════════════
    // 9. LOCAL TIME
    // ════════════════════════════════════════════════
    const timeEl = document.getElementById('local-time');
    if (timeEl) {
        const now  = new Date();
        const h    = now.getHours();
        const m    = now.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        timeEl.textContent = `Local time ${h % 12 || 12}:${m} ${ampm}`;
    }

});
