// Capitaliza a primeira letra de cada palavra.
// Usa \S em vez de \w para cobrir acentos/caracteres UTF-8 (ex: Água, Álcool).
export const toTitleCase = (str) => {
	if (!str) return ''
	return str.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase())
}

// Capitaliza apenas a primeira letra da frase
export const toSentenceCase = (str) => {
	if (!str) return ''
	return str.charAt(0).toUpperCase() + str.slice(1)
}

// Handler para input que capitaliza ao digitar
export const titleCaseHandler = (setter) => (e) => {
	const val = e.target.value
	const cursor = e.target.selectionStart
	const formatted = toTitleCase(val)
	setter(formatted)
	// Restaura posição do cursor após setState
	requestAnimationFrame(() => {
		e.target.setSelectionRange(cursor, cursor)
	})
}
