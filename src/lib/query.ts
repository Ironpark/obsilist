type Token = {
    type: "bracket" | "logic" | "cmp" | "value" | "field";
    value: any;
    close?: boolean;
};

function tokenization(s: string): Token[] {
    const patterns: RegExp[] = [
        /\".*?\"/g, // Double-quoted strings
        /\[\s*(\".*?\"|\d+)(\s*,\s*(\".*?\"|\d+))*\s*\]/g, // Arrays of strings and/or numbers
        /\bin\b|\band\b|\bor\b|<|=|>/g, // Operators
        /\d+/g, // Numbers outside of arrays
        /[a-zA-Z_][a-zA-Z0-9_]*/g, // Identifiers (variable names)
        /[(),]/g // Parentheses and commas
    ];

    let tokens: string[] = [];
    s.replace(new RegExp(patterns.map(p => p.source).join('|'), 'g'), match => {
        tokens.push(match);
        return match;
    });

    return tokens.map(x => {
        if (['(', ')'].includes(x)) {
            return { type: "bracket", value: x };
        }
        if (['and', 'or'].includes(x)) {
            return { type: "logic", value: x };
        }
        if (['<', '>', '=', 'in'].includes(x)) {
            return { type: "cmp", value: x };
        }
        if (x[0] === '[') return { type: "value", value: JSON.parse(x) };
        if (x[0] === '"') return { type: "value", value: x.slice(1, -1) };
        if (/^-?\d+$/.test(x)) return { type: "value", value: Number(x) };
        return { type: "field", value: x };
    });
}

type Item = {
    [key: string]: any;
};

function queryFilter(items: Item[], query_str: string): any[] {
    let filteredList: Item[] = [];
    let query = tokenization(query_str);
    let executed = items
        .map(item => query.map(x => x.type === "field" ? { type: "value", value: item[x.value] } as Token : x))
        .map(tokens => {
            for (let i = tokens.length - 1; i >= 0; i--) {
                if (tokens[i].type === "cmp" && tokens[i].value === "in") {
                    let before = tokens[i - 1];
                    let after = tokens[i + 1];
                    tokens[i - 1] = after;
                    tokens[i + 1] = before;
                    tokens[i + 1].close = true;
                }
            }
            return tokens;
        })
        .map(tokens => tokens.map(token => {
            let value = token.value;
            let type = token.type;
            if (type === "value") {
                return JSON.stringify(value) + (token.close === true ? ")" : "");
            } else if (type === "logic") {
                //@ts-ignore
                return { "or": "||", "and": "&&" }[value];
            } else if (type === "cmp" && value === "=") {
                return "==";
            } else if (type === "cmp" && value === "in") {
                return ".includes(";
            }
            return value;
        }).join(''))
        .map(x => eval(x));

    for (let i = 0; i < executed.length; i++) {
        if (executed[i]) {
            filteredList.push(items[i]);
        }
    }
    return filteredList;
}

export default queryFilter;
