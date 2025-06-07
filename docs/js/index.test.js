describe('index.html DOM elements', () => {
  beforeAll(() => {
    // Load the HTML file content
    // In a real testing environment, you would load the HTML file
    // or use a testing library like Jest with jsdom.
    // For this example, we assume the HTML is already loaded in the DOM.
  });

  test('should have a login container', () => {
    expect(document.querySelector('#login-container')).not.toBeNull();
  });

  test('should have a login tab', () => {
    expect(document.querySelector('#tab-login')).not.toBeNull();
  });

  test('should have a register tab', () => {
    expect(document.querySelector('#tab-register')).not.toBeNull();
  });

  test('should have a recover password tab', () => {
    expect(document.querySelector('#tab-recover')).not.toBeNull();
  });

  test('should have a login form', () => {
    expect(document.querySelector('#login-form')).not.toBeNull();
  });

  test('should have a register form', () => {
    expect(document.querySelector('#register-form')).not.toBeNull();
  });

  test('should have a recover password form', () => {
    expect(document.querySelector('#recover-form')).not.toBeNull();
  });

  test('should have a toggle sidebar button', () => {
    expect(document.querySelector('#toggle-sidebar')).not.toBeNull();
  });

  test('should have a sidebar', () => {
    expect(document.querySelector('.sidebar')).not.toBeNull();
  });

  test('should have a main content area', () => {
    expect(document.querySelector('main')).not.toBeNull();
  });

  test('should have a main menu section', () => {
    expect(document.querySelector('.menu-principal')).not.toBeNull();
  });
});