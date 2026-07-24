// crm-redes/scripts/verify-parity.mjs
// Compares db.js (JSON) vs db.supabase.js (Postgres) output for the same
// real clientIds — run AFTER migrate-to-supabase.mjs, BEFORE Task 5's cutover.
import 'dotenv/config';
import * as jsonDb from '../db.js';
import * as supaDb from '../db.supabase.js';

const REAL_CLIENT_IDS = [
  'cli_demo', 'cli_dicolseg', 'cli_avila_internacional', 'cli_adriana_ortega',
  'cli_lucy_moreno', 'cli_star_light_garden', 'cli_juan_marulanda',
  'cli_fiesta_auto_insurance', 'cli_seguros_diterich',
];

function diffKeys(a, b, label) {
  const ak = Object.keys(a || {}).sort();
  const bk = Object.keys(b || {}).sort();
  if (JSON.stringify(ak) !== JSON.stringify(bk)) {
    console.error(`  ✗ ${label}: claves distintas.\n    JSON:     ${ak.join(',')}\n    Supabase: ${bk.join(',')}`);
    return false;
  }
  return true;
}

async function main() {
  let failures = 0;
  for (const clientId of REAL_CLIENT_IDS) {
    console.log(`\nCliente ${clientId}:`);
    const jsonClient = jsonDb.findClient(clientId);
    const supaClient = await supaDb.findClient(clientId);
    if (!jsonClient && !supaClient) { console.log('  (no existe en ninguno de los dos — ok, se salta)'); continue; }
    if (!jsonClient || !supaClient) { console.error(`  ✗ existe en uno pero no en el otro`); failures++; continue; }
    if (!diffKeys(jsonClient, supaClient, 'findClient')) failures++;
    if (jsonClient.fullName !== supaClient.fullName) { console.error(`  ✗ fullName distinto: "${jsonClient.fullName}" vs "${supaClient.fullName}"`); failures++; }
    else console.log(`  ✓ findClient coincide (${jsonClient.fullName})`);

    const jsonPlan = jsonDb.planFor(clientId);
    const supaPlan = await supaDb.planFor(clientId);
    if (JSON.stringify(jsonPlan) !== JSON.stringify(supaPlan)) {
      console.error(`  ✗ planFor difiere:\n    JSON:     ${JSON.stringify(jsonPlan)}\n    Supabase: ${JSON.stringify(supaPlan)}`);
      failures++;
    } else console.log('  ✓ planFor coincide');

    const jsonMetrics = jsonDb.metricsFor(clientId);
    const supaMetrics = await supaDb.metricsFor(clientId);
    if (jsonMetrics.audienceTotal !== supaMetrics.audienceTotal || jsonMetrics.openDeals !== supaMetrics.openDeals) {
      console.error(`  ✗ metricsFor difiere en audienceTotal/openDeals:\n    JSON:     ${JSON.stringify(jsonMetrics)}\n    Supabase: ${JSON.stringify(supaMetrics)}`);
      failures++;
    } else console.log('  ✓ metricsFor coincide (audienceTotal, openDeals)');
  }

  console.log(failures === 0 ? '\n=== TODO COINCIDE — listo para Task 5 ===' : `\n=== ${failures} DIFERENCIA(S) — NO proceder con Task 5 hasta resolver ===`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
