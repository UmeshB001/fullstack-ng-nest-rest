import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverShadow]', // Directive selector to apply the hover shadow effect
  standalone: true, //  Make the directive standalone for easier usage without needing to declare it in a module
})
export class HoverShadowDirective {
  // HostBinding is used to bind a class to the host element of the directive. In this case, we are binding the 'hover:shadow-lg' class to the host element when the isHovering property is true.
  @HostBinding('class.hover:shadow-lg') isHovering = false; // @HostBinding to toggle shadow on hover
  @HostBinding('class.transition-shadow') transition = 'all 0.3s ease'; // Smooth transition for shadow effect

  @HostListener('mouseenter') onMouseEnter() {
    // @HostListener to listen for mouse enter event
    this.isHovering = true; // Set isHovering to true when mouse enters the element
  }

  @HostListener('mouseleave') onMouseLeave() {
    // @HostListener to listen for mouse leave event
    this.isHovering = false; // Set isHovering to false when mouse leaves the element
  }
}
