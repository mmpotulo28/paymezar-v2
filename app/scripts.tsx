import Script from "next/script";

const Scripts = () => {
	return (
		<>
			<Script
				id="newrelic-browser-agent"
				strategy="beforeInteractive"
				dangerouslySetInnerHTML={{
					__html: `
;window.NREUM||(NREUM={});NREUM.init={session_replay:{enabled:true,block_selector:'',mask_text_selector:'*',sampling_rate:10.0,error_sampling_rate:100.0,mask_all_inputs:true,collect_fonts:true,inline_images:false,inline_stylesheet:true,fix_stylesheets:true,preload:true,mask_input_options:{}},distributed_tracing:{enabled:true},privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]}};
;NREUM.loader_config={accountID:"6853570",trustKey:"6853570",agentID:"1134612898",licenseKey:"NRJS-0d9d426de3b1f4e3c9f",applicationID:"1134612898"};
;NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"NRJS-0d9d426de3b1f4e3c9f",applicationID:"1134612898",sa:1};
`,
				}}
			/>
		</>
	);
};

export default Scripts;
