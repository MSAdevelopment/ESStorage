// ================== Easy & Secure ESStorage ==================
// Tiny library for encrypted localStorage
// by MSA Development
// Features: save, read, and display all ESStorage items in console
// Secure enough for casual use (XOR + HMAC simple tamper detection)

// ------------------ Configuration ------------------
const SECRET = "MSADEVCODE";   // secret key for XOR encryption
const ES_PREFIX = "ES_";         // prefix to identify ESStorage items
const BASE_ITEMS = [
    "iA", "IUF", "Asd", "Xx", "ZZ",
    "!@#", "$$$", "***", "###", "%%%",
    "αβγ", "δεζ", "λμν", "ξοπ", "ρστ",
    "🔥", "💀", "👻", "🌀", "⚡"
];

let items = initItems(); // persistent items for encode/decode

// ------------------ XOR Encryption/Decryption ------------------
function xor(str, key) {
    // Simple XOR for obfuscation
    return Array.from(str)
        .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)))
        .join('');
}

// ------------------ Encode Keys ------------------
function encodeKey(str) {
    // Encode name/key to Base64 for basic obfuscation
    return btoa(str);
}

// ------------------ Simple HMAC ------------------
function simpleHMAC(str, key) {
    // Simple hash for tamper detection
    let hash = 0;
    const combined = str + key;
    for (let i = 0; i < combined.length; i++) {
        hash = (hash << 5) - hash + combined.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}

// ================== Main ESStorage Function ==================
function es(name, content, key) {
    const eName = ES_PREFIX + encodeKey(name);
    const eKey = encodeKey(key);

    // --- Save Data ---
    if (content !== undefined) {
        const encrypted = xor(content, SECRET);
        const hmac = simpleHMAC(encrypted, eKey);
        localStorage.setItem(eName, JSON.stringify({ data: encrypted, hmac: hmac }));
        return true;
    } 
    // --- Read Data ---
    else {
        const raw = localStorage.getItem(eName);
        if (!raw) throw new Error("No item found");

        const obj = JSON.parse(raw);
        if (obj.hmac !== simpleHMAC(obj.data, eKey)) throw new Error("Tamper detected!");
        return xor(obj.data, SECRET);
    }
}

// ================== Show All ESStorage Items ==================
function esShowAll() {
    console.log("=== All ESStorage Items ===");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith(ES_PREFIX)) continue;

        const raw = localStorage.getItem(key);
        try {
            const obj = JSON.parse(raw);
            const decrypted = xor(obj.data, SECRET);
            console.log(key.replace(ES_PREFIX, ""), ":", decrypted);
        } catch {
            console.log(key, ":", raw);
        }
    }
    console.log("=== End of ESStorage Items ===");
}

// ================== Persistent Encode/Decode Items ==================
function en(id) {
    return encode(id, items);
}

function de(id) {
    return decode(id, items);
}

// ------------------ Initialize Persistent Items ------------------
function initItems() {
    const key = "obf_items_v1";
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);

    const internalItems = [...BASE_ITEMS];
    for (let i = 0; i < 2000; i++) {
        internalItems.push(Math.random().toString(36).slice(2, 10));
    }
    const unique = Array.from(new Set(internalItems));
    localStorage.setItem(key, JSON.stringify(unique));
    return unique;
}

// ------------------ Random Index Helper ------------------
function randIndex(n) {
    if (crypto?.getRandomValues) {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return buf[0] % n;
    }
    return Math.floor(Math.random() * n);
}

// ------------------ Encode/Decode Functions ------------------
function encode(word, items) {
    const chars = Array.from(word);
    let out = "";
    for (const ch of chars) {
        out += ch + items[randIndex(items.length)];
    }
    return out;
}

function decode(hashed, items) {
    const sorted = [...items].sort((a, b) => b.length - a.length);
    let i = 0;
    let original = "";

    while (i < hashed.length) {
        const cp = hashed.codePointAt(i);
        const ch = String.fromCodePoint(cp);
        original += ch;
        i += ch.length;

        let matched = false;
        for (const token of sorted) {
            if (hashed.startsWith(token, i)) {
                i += token.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            throw new Error("Decode failed: items mismatch or corrupted input");
        }
    }
    return original;
}

// ================== Usage Examples ==================
// Save data: es('myKey','myContent','myPassword')
// Read data: es('myKey', undefined, 'myPassword')
// Show all ESStorage items: esShowAll()
