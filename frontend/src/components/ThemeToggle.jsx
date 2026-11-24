function ThemeToggle({ Theme, SetTheme }) {

    const HandleTheme = () => {
        if (Theme === 'dark') {
            SetTheme('light');
        }
        else {
            SetTheme('dark');
        }
    };

    return (
        <button
            className="theme-toggle"
            onClick={HandleTheme}
        >
            {Theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}

export default ThemeToggle;