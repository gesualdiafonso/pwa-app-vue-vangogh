<script>
import { RouterLink, RouterView } from 'vue-router'
import 'animate.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
  },
  data() {
    return {
      isScrolled: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
    this.onScroll()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      this.isScrolled = window.scrollY > 50
    },
    beforeEnter(el) {
      el.classList.remove('animate__animated', 'animate__backOutLeft', 'animate__delay-2s')
      el.classList.add('animate__animated', 'animate__backInRight')
    },
    enter(el, done) {
      el.addEventListener('animationend', done, { once: true })
    },
    leave(el, done) {
      el.classList.remove('animate__animated', 'animate__backInRight', 'animate__delay-2s')
      el.classList.add('animate__animated', 'animate__backOutLeft')
      el.addEventListener('animationend', done, { once: true })
    },
  },
}
</script>

<template>
  <header>
    <div>
      <nav
        :class="[
          'navbar container navbar-expand-lg navbar-light header-nav w-100',
          { 'navbar-scrolled': isScrolled },
        ]"
      >
        <div class="container-fluid">
          <RouterLink to="/">
            <h1 class="logo slide-in-left delay-1">Van Gogh</h1>
          </RouterLink>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            :class="[
              'collapse navbar-collapse',
              isScrolled ? 'navbar-dark' : 'navbar-light bg-light',
            ]"
            id="navbarNavDropdown"
          >
            <ul class="navbar-nav ms-auto px-5">
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/about">Biografía</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/movimiento">Movimiento</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/formulario">Que obra soy?</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <transition
      name="route"
      mode="out-in"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <RouterView />
    </transition>
  </main>
  <footer class="container-fluid bg bg-dark mt-5 py-5">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-8">
          <h2 class="logo">Vincent Van Gogh</h2>
          <div class="decor-line-dos w-25"></div>
        </div>

        <div class="col-12 col-lg-4 text-align-end">
          <ul class="list-unstyled text-light">
            <li>Trabajo: Primer Parcial</li>
            <li>Aplicaciones para Dispositivos Móviles</li>
            <li>Prof: Mabel García</li>
            <li>Comisión: DWN3AV</li>
          </ul>
        </div>
      </div>

      <div class="decor-line-dos animated slide-in-right delay-2"></div>
      <div class="my-4 text-light w-100 d-flex justify-content-center align-items-center">
        <div>
          <ul
            class="d-flex flex-column flex-lg-row justify-content-center align-items-center list-unstyled"
          >
            <div class="text-center">
              <img
                class="img-fluid w-100"
                src="../public/images/integrantes/foto_de_afon.jpg"
                alt="foto de Afonso"
              />
            </div>

            <div class="w-100 m-3">
              <li>Afonso Arruda Gesualdi</li>
              <li>gesualdiafonsoarr@gmail.com</li>
            </div>
          </ul>
        </div>
      </div>
    </div>
    <div class="container_fluid decor-line-dos animated slide-in-right delay-2"></div>

    <p class="text-center my-4 fs-6 text-light">
      © Van Gogh 2025 | Todos los derechos reservados al autor
    </p>
  </footer>
</template>

<style scoped>
.header-nav {
  transition: all 0.5s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: transparent;
}

.navbar-scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  top: 1%;
  transition: all 0.5s ease;
}

main {
  margin-top: 80px; /* Ajustar según la altura de tu navbar */
}
</style>
