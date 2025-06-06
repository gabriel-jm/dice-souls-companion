import './profiles-dialog.css'
import { html } from 'lithen-fns'

export function profilesDialog() {
  function closeDialog() {
    profileDialogEl.close()
  }

  return html`
    <dialog class="profiles-dialog" id="profileDialogEl">
      <div class="profiles-container">
        <header>
          <h1>Perfis</h1>
        </header>

        <button on-click=${closeDialog}>close</button>

        <section>
          <div>
            Padrão
          </div>
          <div>
            ${dieEffectsList()}
          </div>
        </section>
      </div>
    </dialog>
  `
}

function dieEffectsList() {
  return html`
    <div>
      <div>
        <h4>Dado Vermelho</h4>
      </div>
      <ol>
        <li>Armas Nv.1</li>
        <li>Só Escudo</li>
        <li>Proibido Curar</li>
        <li>Sem Elixir Magnífico</li>
        <li>Sem Summon</li>
        <li>Sem Cinza da Guerra</li>
        <li>Region Lock</li>
        <li>Run Genocida</li>
        <li>Sem Armadura</li>
        <li>Não upar STR/DEX</li>
        <li>Não upar INT/FTH/ARC</li>
        <li>Não upar HP</li>
        <li>Sem Mesa Redonda</li>
        <li>Use O Que Ver</li>
        <li>Sem Torrent</li>
        <li>Sem Mapa</li>
        <li>100% Drop Rate</li>
        <li>5x Runas</li>
        <li>Adiciona 50k de Souls</li>
        <li>Inimigos Paralisados</li>
      </ol>
    </div>
  `
}
