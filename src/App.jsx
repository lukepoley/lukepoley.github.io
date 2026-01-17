import { useState, useEffect, useRef } from 'react'
import Scene from './components/Scene'
import MatrixBackground from './components/MatrixBackground'

function App() {
    // Helper to generate help content to reuse in initial state
    const getHelpContent = (onCmd) => (
        <div className="response-list">
            <div>Available commands:</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('./projects')}>./projects</span>: View my projects</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('./about')}>./about</span>: About me</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('./contact')}>./contact</span>: Contact info</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('clear')}>clear</span>: Clear terminal</div>
        </div>
    );

    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const endRef = useRef(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let response = null;

        switch (trimmedCmd) {
            case 'help':
                response = getHelpContent(handleCommand);
                break;
            case './projects':
                response = (
                    <div className="response-list">
                        <div>My Projects:</div>
                        <div>1. <a href="https://github.com/lpoley/project1" target="_blank" rel="noopener noreferrer">Project Alpha</a> - A cool thing</div>
                        <div>2. <a href="https://github.com/lpoley/project2" target="_blank" rel="noopener noreferrer">Project Beta</a> - Another cool thing</div>
                        <div>3. <a href="#" onClick={(e) => e.preventDefault()}>Nested Link Demo</a></div>
                    </div>
                );
                break;
            case './about':
                response = "I am a developer who loves terminals and 3D graphics.";
                break;
            case './contact':
                response = (
                    <div>
                        Email: <a href="mailto:lpoley@example.com">lpoley@example.com</a>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case '':
                break;
            default:
                response = `Command not found: ${trimmedCmd}`;
        }

        if (response || trimmedCmd === '') {
            setHistory(prev => [...prev,
            { type: 'command', content: cmd },
            { type: 'output', content: response }
            ]);
        } else {
            setHistory(prev => [...prev, { type: 'command', content: cmd }]);
        }
    };

    // Initial load effect
    useEffect(() => {
        setHistory([
            { type: 'output', content: "Welcome to lpoley terminal v1.0.0" },
            { type: 'output', content: getHelpContent(handleCommand) }
        ]);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div className="app-container" onClick={focusInput}>
            <MatrixBackground />
            <div className="terminal-interface">
                <div className="history">
                    {history.map((item, index) => (
                        <div key={index} className={`line ${item.type}`}>
                            {item.type === 'command' && <span className="prompt">lpoley@website:~$ </span>}
                            {item.content}
                        </div>
                    ))}
                </div>
                <div className="input-line">
                    <span className="prompt">lpoley@website:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="terminal-input"
                        autoFocus
                    />
                </div>
                <div ref={endRef} />
            </div>
            <Scene />
        </div>
    )
}

export default App
